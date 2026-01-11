import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HallsService } from './halls.service';
import { CreateHallDto } from './dto/create-hall.dto';

@ApiTags('Halls')
@Controller('cinemas/:cinemaId/halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Post()
  create(@Param('cinemaId') cinemaId: string, @Body() dto: CreateHallDto) {
    return this.hallsService.create(cinemaId, dto);
  }

  @Get()
  findAll(@Param('cinemaId') cinemaId: string) {
    return this.hallsService.findAll(cinemaId);
  }
}
