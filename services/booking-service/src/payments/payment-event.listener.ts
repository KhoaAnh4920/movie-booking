import { Injectable, Logger } from '@nestjs/common';
import {
  AmqpConnection,
  RabbitSubscribe,
  MessageHandlerErrorBehavior,
} from '@golevelup/nestjs-rabbitmq';
import {
  PAYMENT_EXCHANGE,
  PAYMENT_QUEUE,
  PAYMENT_ROUTING_KEYS,
} from '../rabbitmq/rabbitmq.config';
import { PaymentEvent, PaymentStatus } from './payment-event.dto';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentEventListener {
  private readonly logger = new Logger(PaymentEventListener.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: PAYMENT_EXCHANGE,
    routingKey: [...PAYMENT_ROUTING_KEYS, 'payment.retry.back'],
    queue: PAYMENT_QUEUE,
    queueOptions: {
      arguments: {
        'x-dead-letter-exchange': 'payment.retry',
        'x-dead-letter-routing-key': 'retry',
      },
    },
    errorBehavior: MessageHandlerErrorBehavior.NACK,
  })
  async handle(event: PaymentEvent, msg: any) {
    try {
      this.logger.log(
        `Payment event received bookingId=${event.bookingId}, status=${event.status}`,
      );

      // throw new Error('Simulated Processing Error for DLQ Test');

      const eventKey = `${event.bookingId}:${event.status}`;

      // Idempotency check
      if (await this.bookingsService.isEventProcessed(eventKey)) {
        this.logger.warn(`Duplicate event ignored: ${eventKey}`);
        return;
      }

      if (event.status === PaymentStatus.SUCCESS) {
        await this.bookingsService.confirmBooking(event.bookingId);
      } else if (event.status === PaymentStatus.FAILED) {
        await this.bookingsService.cancelBooking(event.bookingId);
      }

      await this.bookingsService.markEventProcessed(eventKey);
    } catch (error: any) {
      const retryCount = this.getRetryCount(msg);
      this.logger.error(
        `Error processing payment event (Attempt ${retryCount + 1}/${
          this.MAX_RETRIES + 1
        }): ${error.message}`,
      );

      if (retryCount >= this.MAX_RETRIES) {
        this.logger.error(
          `Max retries reached for bookingId=${event.bookingId}. Sending to DLQ.`,
        );
        await this.amqpConnection.publish('payment.dlq', 'dlq', event);
        return;
      }

      throw error;
    }
  }

  private getRetryCount(msg: any): number {
    const xDeath = msg.properties?.headers?.['x-death'];
    if (!xDeath || !Array.isArray(xDeath) || xDeath.length === 0) {
      return 0;
    }

    const deathInfo = xDeath.find((d) => d.queue === PAYMENT_QUEUE);
    return deathInfo ? Number(deathInfo.count) : 0;
  }
}
