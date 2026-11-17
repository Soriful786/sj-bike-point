import { Module } from '@nestjs/common';
import {
  GarageSettingsController,
  PublicAvailabilityController,
  SlotOverridesController,
} from './booking-slots.controller.js';
import { BookingSlotsService } from './booking-slots.service.js';

@Module({
  controllers: [PublicAvailabilityController, GarageSettingsController, SlotOverridesController],
  providers: [BookingSlotsService],
  exports: [BookingSlotsService],
})
export class BookingSlotsModule {}