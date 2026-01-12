import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(private readonly prisma: PrismaClient) {}

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
}
