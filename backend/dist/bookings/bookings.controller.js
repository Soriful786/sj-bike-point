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
import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, Req, } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { BookingsService } from './bookings.service.js';
import { AdminCreateBookingDto, AssignMechanicDto, ChangeStatusDto, CreateBookingDto, ListBookingsQuery, RescheduleDto, TrackBookingDto, } from './dto/bookings.dto.js';
let PublicBookingsController = class PublicBookingsController {
    bookings;
    constructor(bookings) {
        this.bookings = bookings;
    }
    create(dto) {
        return this.bookings.createPublic(dto);
    }
    track(dto) {
        return this.bookings.track(dto.bookingRef, dto.phone);
    }
};
__decorate([
    Public(),
    Throttle({ default: { limit: 10, ttl: 60_000 } }),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBookingDto]),
    __metadata("design:returntype", void 0)
], PublicBookingsController.prototype, "create", null);
__decorate([
    Public(),
    Throttle({ default: { limit: 10, ttl: 60_000 } }),
    Post('track'),
    HttpCode(200),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrackBookingDto]),
    __metadata("design:returntype", void 0)
], PublicBookingsController.prototype, "track", null);
PublicBookingsController = __decorate([
    Controller('public/bookings'),
    __metadata("design:paramtypes", [BookingsService])
], PublicBookingsController);
export { PublicBookingsController };
let BookingsController = class BookingsController {
    bookings;
    constructor(bookings) {
        this.bookings = bookings;
    }
    list(query, req) {
        return this.bookings.list(query, req.user);
    }
    detail(id, req) {
        return this.bookings.getDetail(id, req.user);
    }
    create(dto, req) {
        return this.bookings.createByStaff(dto, req.user);
    }
    changeStatus(id, dto, req) {
        return this.bookings.changeStatus(id, dto, req.user);
    }
    reschedule(id, dto, req) {
        return this.bookings.reschedule(id, dto, req.user);
    }
    assign(id, dto, req) {
        return this.bookings.assignMechanic(id, dto.mechanicId, req.user);
    }
};
__decorate([
    Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.MECHANIC),
    Get(),
    __param(0, Query()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListBookingsQuery, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "list", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.MECHANIC),
    Get(':id'),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "detail", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST),
    Post(),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdminCreateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.MECHANIC),
    Patch(':id/status'),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ChangeStatusDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "changeStatus", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST),
    Patch(':id/reschedule'),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RescheduleDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "reschedule", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER),
    Patch(':id/assign'),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AssignMechanicDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "assign", null);
BookingsController = __decorate([
    Controller('bookings'),
    __metadata("design:paramtypes", [BookingsService])
], BookingsController);
export { BookingsController };
//# sourceMappingURL=bookings.controller.js.map