import { Module } from '@nestjs/common';
import { PublicServicesController, ServicesController } from './services.controller.js';
import { ServicesService } from './services.service.js';

@Module({
  controllers: [PublicServicesController, ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}