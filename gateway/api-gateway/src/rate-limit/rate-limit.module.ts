import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import Redis from 'ioredis';
import { UserThrottlerGuard } from './user-throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        const redis = new Redis({
          host: 'localhost',
          port: 6379,
        });

        return {
          throttlers: [
            {
              ttl: 60000,
              limit: 20,
            },
          ],
          storage: new ThrottlerStorageRedisService(redis),
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserThrottlerGuard,
    },
  ],
})
export class RateLimitModule {}
