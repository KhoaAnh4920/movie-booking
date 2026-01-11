import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CinemasModule } from './cinemas/cinemas.module';
import { HallsModule } from './halls/halls.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
