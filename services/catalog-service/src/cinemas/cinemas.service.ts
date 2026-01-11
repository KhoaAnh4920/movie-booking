import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCinemaDto } from './dto/create-cinema.dto';

@Injectable()
export class CinemasService {
  constructor(private readonly prisma: PrismaClient) {}

  create(dto: CreateCinemaDto) {
    return this.prisma.cinema.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.cinema.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
