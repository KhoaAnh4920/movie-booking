import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingTimeoutWorker } from './booking-timeout.worker';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, BookingTimeoutWorker],
})
export class BookingsModule {}
