import { Module } from '@nestjs/common';
import { InternalController } from './internal.controller';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { ShowtimesService } from 'src/showtimes/showtimes.service';

@Module({
  imports: [ShowtimesModule],
  controllers: [InternalController],
  providers: [ShowtimesService],
})
export class InternalModule {}
