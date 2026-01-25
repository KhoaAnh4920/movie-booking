import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { bookingProxy } from './booking.proxy';
import { catalogProxy } from './catalog.proxy';

@Module({})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(bookingProxy).forRoutes('/api/bookings');

    consumer.apply(catalogProxy).forRoutes('/api/catalog');
  }
}
