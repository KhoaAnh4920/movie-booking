import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@ApiTags('Showtimes')
@Controller()
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post('halls/:hallId/showtimes')
  create(@Param('hallId') hallId: string, @Body() dto: CreateShowtimeDto) {
    return this.showtimesService.create(hallId, dto);
  }

  @Get('movie-versions/:movieVersionId/showtimes')
  findByMovieVersion(@Param('movieVersionId') movieVersionId: string) {
    return this.showtimesService.findByMovieVersion(movieVersionId);
  }
}
