import { Module } from '@nestjs/common';
import {
  PublicCategoriesController,
  ServiceCategoriesController,
} from './service-categories.controller.js';
import { ServiceCategoriesService } from './service-categories.service.js';

@Module({
  controllers: [PublicCategoriesController, ServiceCategoriesController],
  providers: [ServiceCategoriesService],
  exports: [ServiceCategoriesService],
})
export class ServiceCategoriesModule {}