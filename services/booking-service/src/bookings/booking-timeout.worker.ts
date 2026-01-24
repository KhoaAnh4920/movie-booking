import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingsService } from './bookings.service';

@Injectable()
export class BookingTimeoutWorker {
  private readonly logger = new Logger(BookingTimeoutWorker.name);

  constructor(private readonly bookingService: BookingsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cancelExpiredBookings() {
    this.logger.log('Running booking timeout worker...');
    return this.bookingService.cancelExpiredBookings();
  }
}
