import { Module, forwardRef } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingTimeoutWorker } from './booking-timeout.worker';
import { CatalogModule } from 'src/catalog/catalog.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [CatalogModule, forwardRef(() => PaymentsModule)],
  controllers: [BookingsController],
  providers: [BookingsService, BookingTimeoutWorker],
  exports: [BookingsService],
})
export class BookingsModule {}
