import { Global, Module } from '@nestjs/common';
import { prismaClient } from './prisma.provider';
import { PrismaClient } from '@prisma/client/scripts/default-index.js';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useValue: prismaClient,
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
