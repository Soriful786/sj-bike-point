import { Module } from '@nestjs/common';
import { BookingSlotsModule } from '../booking-slots/booking-slots.module.js';
import { BookingsController, PublicBookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';

@Module({
  imports: [BookingSlotsModule],
  controllers: [PublicBookingsController, BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}