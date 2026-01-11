import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateHallDto } from './dto/create-hall.dto';

@Injectable()
export class HallsService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(cinemaId: string, dto: CreateHallDto) {
    const cinema = await this.prisma.cinema.findUnique({
      where: { id: cinemaId },
    });

    if (!cinema) {
      throw new NotFoundException('Cinema not found');
    }

    return this.prisma.hall.create({
      data: {
        ...dto,
        cinemaId,
      },
    });
  }

  async findAll(cinemaId: string) {
    const cinema = await this.prisma.cinema.findUnique({
      where: { id: cinemaId },
    });

    if (!cinema) {
      throw new NotFoundException('Cinema not found');
    }

    return this.prisma.hall.findMany({
      where: { cinemaId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
