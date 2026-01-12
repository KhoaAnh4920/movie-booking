import { Module } from '@nestjs/common';
import { MovieVersionsController } from './movie-versions.controller';
import { MovieVersionsService } from './movie-versions.service';

@Module({
  controllers: [MovieVersionsController],
  providers: [MovieVersionsService]
})
export class MovieVersionsModule {}
