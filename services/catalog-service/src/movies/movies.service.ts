import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: {
        title: dto.title,
        description: dto.description,
        image: dto.image,
        rating: dto.rating,
        genres: dto.genres,
        durationMinutes: dto.durationMinutes,
        releaseDate: new Date(dto.releaseDate),
        status: dto.status,
      },
    });
  }

  async findAll() {
    return this.prisma.movie.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async findShowtimesByMovieId(movieId: string) {
    const movie = await this.findById(movieId);

    return this.prisma.showtime.findMany({
      where: {
        movieVersion: {
          movieId: movie.id,
        },
      },
      include: {
        movieVersion: true,
        hall: {
          include: {
            cinema: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }
}
