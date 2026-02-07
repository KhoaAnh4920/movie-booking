import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
