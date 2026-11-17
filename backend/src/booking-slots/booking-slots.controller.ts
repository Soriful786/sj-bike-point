import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { BookingSlotsService } from './booking-slots.service.js';
import {
  AvailabilityQuery,
  CreateSlotOverrideDto,
  UpdateGarageSettingsDto,
} from './dto/slots.dto.js';

@Controller('public')
export class PublicAvailabilityController {
  constructor(private readonly slots: BookingSlotsService) {}

  @Public()
  @Get('availability')
  availability(@Query() query: AvailabilityQuery) {
    return this.slots.getDayAvailability(query.date);
  }

  @Public()
  @Get('settings')
  settings() {
    return this.slots.getPublicSettings();
  }
}

@Controller('settings/garage')
export class GarageSettingsController {
  constructor(private readonly slots: BookingSlotsService) {}

  @Get()
  get() {
    return this.slots.getSettings();
  }

  @Roles(Role.ADMIN)
  @Patch()
  update(@Body() dto: UpdateGarageSettingsDto) {
    return this.slots.updateSettings(dto);
  }
}

@Controller('booking-slots/overrides')
export class SlotOverridesController {
  constructor(private readonly slots: BookingSlotsService) {}

  @Get()
  list() {
    return this.slots.listOverrides();
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  create(@Body() dto: CreateSlotOverrideDto) {
    return this.slots.createOverride(dto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.slots.removeOverride(id);
  }
}