import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateMovieVersionDto } from './dto/create-movie-version.dto';

@Injectable()
export class MovieVersionsService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(movieId: string, dto: CreateMovieVersionDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return this.prisma.movieVersion.create({
      data: {
        movieId,
        versionType: dto.versionType,
        durationMinutes: dto.durationMinutes,
      },
    });
  }

  findByMovie(movieId: string) {
    return this.prisma.movieVersion.findMany({
      where: { movieId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
