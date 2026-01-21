import { Module } from '@nestjs/common';
import { InternalController } from './internal.controller';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [ShowtimesModule],
  controllers: [InternalController],
})
export class InternalModule {}
