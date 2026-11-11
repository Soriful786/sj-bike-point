import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { IsBoolean } from 'class-validator';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import {
  CreateServiceDto,
  ListServicesQuery,
  PublicServicesQuery,
  UpdateServiceDto,
} from './dto/service.dto.js';
import { ServicesService } from './services.service.js';

class SetActiveDto {
  @IsBoolean()
  isActive!: boolean;
}

@Controller('public/services')
export class PublicServicesController {
  constructor(private readonly services: ServicesService) {}

  @Public()
  @Get()
  list(@Query() query: PublicServicesQuery) {
    return this.services.listPublic(query);
  }

  @Public()
  @Get(':slug')
  getOne(@Param('slug') slug: string) {
    return this.services.getPublicBySlug(slug);
  }
}

@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  list(@Query() query: ListServicesQuery) {
    return this.services.listAdmin(query);
  }

  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.services.getAdmin(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.services.create(dto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateServiceDto) {
    return this.services.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/status')
  setStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SetActiveDto) {
    return this.services.setActive(id, dto.isActive);
  }
}