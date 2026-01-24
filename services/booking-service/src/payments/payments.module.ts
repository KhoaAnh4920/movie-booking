import { Module } from '@nestjs/common';
import { PaymentEventListener } from './payment-event.listener';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  providers: [PaymentEventListener],
})
export class PaymentsModule {}
