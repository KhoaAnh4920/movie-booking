import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CinemasModule } from './cinemas/cinemas.module';
import { HallsModule } from './halls/halls.module';
import { MovieVersionsModule } from './movie-versions/movie-versions.module';
import { MoviesModule } from './movies/movies.module';
import { RedisModule } from './redis/redis.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { InternalModule } from './internal/internal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MoviesModule,
    PrismaModule,
    CinemasModule,
    HallsModule,
    MovieVersionsModule,
    ShowtimesModule,
    RedisModule,
    InternalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
