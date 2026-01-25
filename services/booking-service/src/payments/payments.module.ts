import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentEventListener } from './payment-event.listener';
import { BookingsModule } from '../bookings/bookings.module';
import { PaymentClient } from './payment.client';
import { RabbitMqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [HttpModule, forwardRef(() => BookingsModule), RabbitMqModule],
  providers: [PaymentEventListener, PaymentClient],
  exports: [PaymentClient],
})
export class PaymentsModule {}
