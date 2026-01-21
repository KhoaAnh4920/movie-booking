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

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redisService: RedisService,
    private readonly catalogClient: CatalogClient,
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

    await redis.del(...lockKeys);

    return booking;
  }
}
