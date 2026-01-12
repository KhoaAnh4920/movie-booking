import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MovieVersionsService } from './movie-versions.service';
import { CreateMovieVersionDto } from './dto/create-movie-version.dto';

@ApiTags('Movie Versions')
@Controller('movies/:movieId/versions')
export class MovieVersionsController {
  constructor(private readonly movieVersionsService: MovieVersionsService) {}

  @Post()
  create(
    @Param('movieId') movieId: string,
    @Body() dto: CreateMovieVersionDto,
  ) {
    return this.movieVersionsService.create(movieId, dto);
  }

  @Get()
  findByMovie(@Param('movieId') movieId: string) {
    return this.movieVersionsService.findByMovie(movieId);
  }
}
