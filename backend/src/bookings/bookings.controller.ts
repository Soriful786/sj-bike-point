import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import type { RequestWithUser } from '../common/types/auth-user.js';
import { BookingsService } from './bookings.service.js';
import {
  AdminCreateBookingDto,
  AssignMechanicDto,
  ChangeStatusDto,
  CreateBookingDto,
  ListBookingsQuery,
  RescheduleDto,
  TrackBookingDto,
} from './dto/bookings.dto.js';

@Controller('public/bookings')
export class PublicBookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookings.createPublic(dto);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('track')
  @HttpCode(200)
  track(@Body() dto: TrackBookingDto) {
    return this.bookings.track(dto.bookingRef, dto.phone);
  }
}

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.MECHANIC)
  @Get()
  list(@Query() query: ListBookingsQuery, @Req() req: RequestWithUser) {
    return this.bookings.list(query, req.user);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.MECHANIC)
  @Get(':id')
  detail(@Param('id', ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.bookings.getDetail(id, req.user);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST)
  @Post()
  create(@Body() dto: AdminCreateBookingDto, @Req() req: RequestWithUser) {
    return this.bookings.createByStaff(dto, req.user);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.MECHANIC)
  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeStatusDto,
    @Req() req: RequestWithUser,
  ) {
    return this.bookings.changeStatus(id, dto, req.user);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST)
  @Patch(':id/reschedule')
  reschedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RescheduleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.bookings.reschedule(id, dto, req.user);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/assign')
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignMechanicDto,
    @Req() req: RequestWithUser,
  ) {
    return this.bookings.assignMechanic(id, dto.mechanicId, req.user);
  }
}