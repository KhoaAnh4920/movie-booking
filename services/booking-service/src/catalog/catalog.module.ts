import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatalogClient } from './catalog.client';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [CatalogClient],
  exports: [CatalogClient],
})
export class CatalogModule {}
