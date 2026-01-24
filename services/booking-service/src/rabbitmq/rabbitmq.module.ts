import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  PAYMENT_EXCHANGE,
  PAYMENT_QUEUE,
  PAYMENT_ROUTING_KEYS,
} from './rabbitmq.config';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        { name: PAYMENT_EXCHANGE, type: 'topic' },
        { name: 'payment.retry', type: 'direct' },
        { name: 'payment.dlq', type: 'direct' },
      ],
      uri: 'amqp://admin:admin@localhost:5672',
      queues: [
        {
          name: PAYMENT_QUEUE,
          exchange: PAYMENT_EXCHANGE,
          routingKey: [...PAYMENT_ROUTING_KEYS, 'payment.retry.back'],
          options: {
            arguments: {
              'x-dead-letter-exchange': 'payment.retry',
              'x-dead-letter-routing-key': 'retry',
            },
          },
        },
        {
          name: 'booking.payment.retry',
          exchange: 'payment.retry',
          routingKey: 'retry',
          options: {
            arguments: {
              'x-message-ttl': 10000,
              'x-dead-letter-exchange': PAYMENT_EXCHANGE,
              'x-dead-letter-routing-key': 'payment.retry.back',
            },
          },
        },
        {
          name: 'booking.payment.dlq',
          exchange: 'payment.dlq',
          routingKey: 'dlq',
        },
      ],
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMqModule {}
