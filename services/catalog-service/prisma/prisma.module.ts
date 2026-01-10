import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PrismaClient,
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined');
        }

        const adapter = new PrismaPg({
          connectionString: databaseUrl,
        });

        return new PrismaClient({ adapter });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
