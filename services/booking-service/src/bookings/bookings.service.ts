import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RedisService } from '../redis/redis.service';
import { buildSeatLockKey } from '../redis/redis.helper';
import { PrismaClient } from '@prisma/client';
import { CatalogClient } from 'src/catalog/catalog.client';
import { PaymentClient } from 'src/payments/payment.client';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redisService: RedisService,
    private readonly catalogClient: CatalogClient,
    private readonly paymentClient: PaymentClient,
  ) {}

  async create(dto: CreateBookingDto, userId: string) {
    const { showtimeId, seatIds } = dto;

    if (!seatIds.length) {
      throw new BadRequestException('Seat list is empty');
    }

    const redis = this.redisService.getClient();
    const lockKeys: string[] = [];

    for (const seatId of seatIds) {
      const key = buildSeatLockKey(showtimeId, seatId);
      const owner = await redis.get(key);

      if (!owner) {
        throw new ConflictException(`Seat ${seatId} is not held`);
      }

      if (owner !== userId) {
        throw new ForbiddenException(`Seat ${seatId} is held by another user`);
      }

      lockKeys.push(key);
    }

    const quote = await this.catalogClient.quoteSeats(showtimeId, seatIds);

    const booking = await this.prisma.$transaction(async (tx) => {
      const createdBooking = await tx.booking.create({
        data: {
          userId,
          showtimeId,
          status: 'PENDING',
          totalAmount: quote.totalAmount,
        },
      });

      await tx.ticket.createMany({
        data: quote.seats.map((seat: any) => ({
          bookingId: createdBooking.id,
          seatId: seat.seatId,
          seatRow: seat.row,
          seatNumber: seat.number,
          price: seat.price,
        })),
      });

      return createdBooking;
    });

    await this.paymentClient.createPayment({
      bookingId: booking.id,
      amount: booking.totalAmount.toNumber(),
      method: 'CARD',
    });

    await redis.del(...lockKeys);

    return booking;
  }

  async confirmBooking(bookingId: string) {
    await this.prisma.booking.updateMany({
      where: {
        id: bookingId,
        status: 'PENDING',
      },
      data: { status: 'CONFIRMED' },
    });
  }

  async cancelBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tickets: true },
    });

    if (!booking || booking.status !== 'PENDING') return;

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    const redis = this.redisService.getClient();
    for (const ticket of booking.tickets) {
      const key = buildSeatLockKey(booking.showtimeId, ticket.seatId);
      await redis.del(key);
    }
  }

  async isEventProcessed(eventKey: string): Promise<boolean> {
    const count = await this.prisma.processedEvent.count({
      where: { eventKey },
    });
    return count > 0;
  }

  async markEventProcessed(eventKey: string) {
    await this.prisma.processedEvent.create({
      data: { eventKey },
    });
  }

  async cancelExpiredBookings() {
    const timeoutMinutes = 5;
    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: new Date(Date.now() - timeoutMinutes * 60 * 1000),
        },
      },
      include: {
        tickets: true,
      },
    });

    if (!expiredBookings.length) return;

    const redis = this.redisService.getClient();

    for (const booking of expiredBookings) {
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'CANCELLED' },
      });

      for (const ticket of booking.tickets) {
        const key = buildSeatLockKey(booking.showtimeId, ticket.seatId);
        await redis.del(key);
      }
    }
  }
}
