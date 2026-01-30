import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a movie' })
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List movies' })
  findAll() {
    console.log('AAA');
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by id' })
  findById(@Param('id') id: string) {
    return this.moviesService.findById(id);
  }

  @Get(':id/showtimes')
  @ApiOperation({ summary: 'Get showtimes for a movie' })
  getShowtimes(@Param('id') id: string) {
    return this.moviesService.findShowtimesByMovieId(id);
  }
}
