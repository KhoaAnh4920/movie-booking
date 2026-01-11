import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';

@ApiTags('Cinemas')
@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  create(@Body() dto: CreateCinemaDto) {
    return this.cinemasService.create(dto);
  }

  @Get()
  findAll() {
    return this.cinemasService.findAll();
  }
}
