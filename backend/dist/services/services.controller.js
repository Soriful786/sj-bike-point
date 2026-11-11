var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, } from '@nestjs/common';
import { Role } from '@prisma/client';
import { IsBoolean } from 'class-validator';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CreateServiceDto, ListServicesQuery, PublicServicesQuery, UpdateServiceDto, } from './dto/service.dto.js';
import { ServicesService } from './services.service.js';
class SetActiveDto {
    isActive;
}
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], SetActiveDto.prototype, "isActive", void 0);
let PublicServicesController = class PublicServicesController {
    services;
    constructor(services) {
        this.services = services;
    }
    list(query) {
        return this.services.listPublic(query);
    }
    getOne(slug) {
        return this.services.getPublicBySlug(slug);
    }
};
__decorate([
    Public(),
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicServicesQuery]),
    __metadata("design:returntype", void 0)
], PublicServicesController.prototype, "list", null);
__decorate([
    Public(),
    Get(':slug'),
    __param(0, Param('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicServicesController.prototype, "getOne", null);
PublicServicesController = __decorate([
    Controller('public/services'),
    __metadata("design:paramtypes", [ServicesService])
], PublicServicesController);
export { PublicServicesController };
let ServicesController = class ServicesController {
    services;
    constructor(services) {
        this.services = services;
    }
    list(query) {
        return this.services.listAdmin(query);
    }
    getOne(id) {
        return this.services.getAdmin(id);
    }
    create(dto) {
        return this.services.create(dto);
    }
    update(id, dto) {
        return this.services.update(id, dto);
    }
    setStatus(id, dto) {
        return this.services.setActive(id, dto.isActive);
    }
};
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListServicesQuery]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "list", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "getOne", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateServiceDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "create", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER),
    Patch(':id'),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateServiceDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "update", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER),
    Patch(':id/status'),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SetActiveDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "setStatus", null);
ServicesController = __decorate([
    Controller('services'),
    __metadata("design:paramtypes", [ServicesService])
], ServicesController);
export { ServicesController };
//# sourceMappingURL=services.controller.js.map