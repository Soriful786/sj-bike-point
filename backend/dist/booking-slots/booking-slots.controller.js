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
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { BookingSlotsService } from './booking-slots.service.js';
import { AvailabilityQuery, CreateSlotOverrideDto, UpdateGarageSettingsDto, } from './dto/slots.dto.js';
let PublicAvailabilityController = class PublicAvailabilityController {
    slots;
    constructor(slots) {
        this.slots = slots;
    }
    availability(query) {
        return this.slots.getDayAvailability(query.date);
    }
    settings() {
        return this.slots.getPublicSettings();
    }
};
__decorate([
    Public(),
    Get('availability'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AvailabilityQuery]),
    __metadata("design:returntype", void 0)
], PublicAvailabilityController.prototype, "availability", null);
__decorate([
    Public(),
    Get('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicAvailabilityController.prototype, "settings", null);
PublicAvailabilityController = __decorate([
    Controller('public'),
    __metadata("design:paramtypes", [BookingSlotsService])
], PublicAvailabilityController);
export { PublicAvailabilityController };
let GarageSettingsController = class GarageSettingsController {
    slots;
    constructor(slots) {
        this.slots = slots;
    }
    get() {
        return this.slots.getSettings();
    }
    update(dto) {
        return this.slots.updateSettings(dto);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GarageSettingsController.prototype, "get", null);
__decorate([
    Roles(Role.ADMIN),
    Patch(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateGarageSettingsDto]),
    __metadata("design:returntype", void 0)
], GarageSettingsController.prototype, "update", null);
GarageSettingsController = __decorate([
    Controller('settings/garage'),
    __metadata("design:paramtypes", [BookingSlotsService])
], GarageSettingsController);
export { GarageSettingsController };
let SlotOverridesController = class SlotOverridesController {
    slots;
    constructor(slots) {
        this.slots = slots;
    }
    list() {
        return this.slots.listOverrides();
    }
    create(dto) {
        return this.slots.createOverride(dto);
    }
    remove(id) {
        return this.slots.removeOverride(id);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SlotOverridesController.prototype, "list", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSlotOverrideDto]),
    __metadata("design:returntype", void 0)
], SlotOverridesController.prototype, "create", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER),
    Delete(':id'),
    __param(0, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlotOverridesController.prototype, "remove", null);
SlotOverridesController = __decorate([
    Controller('booking-slots/overrides'),
    __metadata("design:paramtypes", [BookingSlotsService])
], SlotOverridesController);
export { SlotOverridesController };
//# sourceMappingURL=booking-slots.controller.js.map