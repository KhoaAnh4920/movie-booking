import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { RedisService } from 'src/redis/redis.service';
import { buildSeatLockKey } from 'src/redis/redis.helper';
import { REDIS_SEAT_LOCK_TTL } from 'src/redis/redis.config';

@Injectable()
export class ShowtimesService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redis: RedisService,
  ) {}

  async create(hallId: string, dto: CreateShowtimeDto) {
    const hall = await this.prisma.hall.findUnique({
      where: { id: hallId },
    });

    if (!hall) {
      throw new NotFoundException('Hall not found');
    }

    const movieVersion = await this.prisma.movieVersion.findUnique({
      where: { id: dto.movieVersionId },
    });

    if (!movieVersion) {
      throw new NotFoundException('Movie version not found');
    }

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const overlap = await this.prisma.showtime.findFirst({
      where: {
        hallId,
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });

    if (overlap) {
      throw new BadRequestException(
        'Showtime overlaps with an existing showtime in this hall',
      );
    }

    return this.prisma.showtime.create({
      data: {
        hallId,
        movieVersionId: dto.movieVersionId,
        startTime,
        endTime,
        priceConfig: dto.priceConfig,
      },
    });
  }

  async findByMovieVersion(movieVersionId: string) {
    return this.prisma.showtime.findMany({
      where: { movieVersionId },
      orderBy: { startTime: 'asc' },
      include: {
        hall: {
          include: {
            cinema: true,
          },
        },
      },
    });
  }

  async holdSeat(showtimeId: string, seatId: string, userId: string) {
    const showTime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
    });

    if (!showTime) {
      throw new NotFoundException('Showtime not found');
    }

    const seat = await this.prisma.seat.findUnique({
      where: { id: seatId },
    });

    if (!seat) {
      throw new NotFoundException('Seat not found');
    }

    const redis = this.redis.getClient();
    const key = buildSeatLockKey(showtimeId, seatId);

    const result = await redis.set(
      key,
      userId,
      'EX',
      REDIS_SEAT_LOCK_TTL,
      'NX',
    );

    if (!result) {
      throw new ConflictException('Seat is already held');
    }

    return {
      status: 'HELD',
      seatId,
      expiresIn: REDIS_SEAT_LOCK_TTL,
    };
  }

  async releaseSeat(showtimeId: string, seatId: string, userId: string) {
    const showTime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
    });

    if (!showTime) {
      throw new NotFoundException('Showtime not found');
    }

    const seat = await this.prisma.seat.findUnique({
      where: { id: seatId },
    });

    if (!seat) {
      throw new NotFoundException('Seat not found');
    }
    const redis = this.redis.getClient();
    const key = buildSeatLockKey(showtimeId, seatId);

    const owner = await redis.get(key);

    if (!owner) {
      return {
        status: 'RELEASED',
        seatId,
      };
    }

    if (owner !== userId) {
      throw new ForbiddenException('You do not own this seat lock');
    }

    await redis.del(key);

    return {
      status: 'RELEASED',
      seatId,
    };
  }

  async quoteSeats(showtimeId: string, seatIds: string[]) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        hall: {
          include: {
            seats: {
              where: { id: { in: seatIds } },
            },
          },
        },
      },
    });

    if (!showtime) {
      throw new Error('Showtime not found');
    }

    const priceConfig = showtime.priceConfig as Record<string, number>;

    const seats = showtime.hall.seats.map((seat) => ({
      seatId: seat.id,
      row: seat.rowCode,
      number: seat.seatNumber,
      type: seat.type,
      price: priceConfig[seat.type],
    }));

    const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);

    return {
      showtimeId,
      seats,
      totalAmount,
    };
  }
}
