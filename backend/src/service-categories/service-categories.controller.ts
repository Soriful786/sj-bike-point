import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
import { ServiceCategoriesService } from './service-categories.service.js';

@Controller('public/categories')
export class PublicCategoriesController {
  constructor(private readonly categories: ServiceCategoriesService) {}

  @Public()
  @Get()
  list() {
    return this.categories.listPublic();
  }
}

@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(private readonly categories: ServiceCategoriesService) {}

  @Get()
  list() {
    return this.categories.listAll();
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
    return this.categories.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categories.remove(id);
  }
}