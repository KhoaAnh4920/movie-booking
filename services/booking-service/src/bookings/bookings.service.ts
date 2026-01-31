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
    try {
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
          throw new ForbiddenException(
            `Seat ${seatId} is held by another user`,
          );
        }

        lockKeys.push(key);
      }

      const quote = await this.catalogClient.quoteSeats(showtimeId, seatIds);

      console.log('Check quote: ', quote);
      const booking = await this.prisma.$transaction(async (tx) => {
        // 1. Double check availability in DB (prevent race condition)
        const existingTickets = await tx.ticket.findMany({
          where: {
            booking: {
              showtimeId,
              status: { in: ['PENDING', 'CONFIRMED'] },
            },
            seatId: { in: seatIds },
          },
        });

        if (existingTickets.length > 0) {
          throw new ConflictException(
            `Seats ${existingTickets.map((t) => t.seatId).join(', ')} are already booked`,
          );
        }

        // 2. Create Booking
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
    } catch (error) {
      console.log('Error creating booking: ', error);
    }
  }

  async getOccupiedSeats(showtimeId: string) {
    // 1. Get confirmed/pending bookings from DB
    const tickets = await this.prisma.ticket.findMany({
      where: {
        booking: {
          showtimeId,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      },
      select: { seatId: true },
    });

    const dbSeatIds = tickets.map((t) => t.seatId);

    // 2. Get held seats from Redis
    const redis = this.redisService.getClient();
    // Pattern: lock:showtime:{showtimeId}:seat:*
    // We use SCAN to avoid blocking Redis if there are many keys (though distinct seat count is low)
    const scanPattern = buildSeatLockKey(showtimeId, '*');
    let cursor = '0';
    const redisSeatIds: string[] = [];

    do {
      const result = await redis.scan(
        cursor,
        'MATCH',
        scanPattern,
        'COUNT',
        100,
      );
      cursor = result[0];
      const keys = result[1];

      keys.forEach((key) => {
        // Key format: ...:seat:{seatId}
        const parts = key.split(':seat:');
        if (parts.length === 2) {
          redisSeatIds.push(parts[1]);
        }
      });
    } while (cursor !== '0');

    // 3. Merge and return unique
    return Array.from(new Set([...dbSeatIds, ...redisSeatIds]));
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
