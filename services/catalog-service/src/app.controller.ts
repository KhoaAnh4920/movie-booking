import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { buildSeatLockKey } from './redis/redis.helper';
import { REDIS_SEAT_LOCK_TTL } from './redis/redis.config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return { status: 'ok', service: 'catalog-service' };
  }

  @Get('health/redis')
  async redisHealth() {
    const client = this.redisService.getClient();
    const result = await client.ping();

    return {
      redis: result,
    };
  }

  @Get('test/redis-key')
  testRedisKey() {
    return {
      key: buildSeatLockKey('showtime123', 'A1'),
      ttl: REDIS_SEAT_LOCK_TTL,
    };
  }
}
