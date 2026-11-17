var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BookingStatus, MotorcycleType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsEmail, IsEnum, IsInt, IsOptional, IsString, IsUUID, Length, Matches, Max, MaxLength, Min, ValidateNested, } from 'class-validator';
import { DATE_PATTERN, TIME_PATTERN } from '../../common/utils/time.js';
export class CustomerInput {
    name;
    phone;
    email;
}
__decorate([
    IsString(),
    Length(2, 100),
    __metadata("design:type", String)
], CustomerInput.prototype, "name", void 0);
__decorate([
    IsString(),
    Length(10, 20),
    __metadata("design:type", String)
], CustomerInput.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsEmail(),
    __metadata("design:type", String)
], CustomerInput.prototype, "email", void 0);
export class MotorcycleInput {
    brand;
    model;
    registrationNumber;
    type;
    manufacturingYear;
}
__decorate([
    IsString(),
    Length(2, 50),
    __metadata("design:type", String)
], MotorcycleInput.prototype, "brand", void 0);
__decorate([
    IsString(),
    Length(1, 50),
    __metadata("design:type", String)
], MotorcycleInput.prototype, "model", void 0);
__decorate([
    IsString(),
    Length(4, 20),
    __metadata("design:type", String)
], MotorcycleInput.prototype, "registrationNumber", void 0);
__decorate([
    IsOptional(),
    IsEnum(MotorcycleType),
    __metadata("design:type", String)
], MotorcycleInput.prototype, "type", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1980),
    Max(2100),
    __metadata("design:type", Number)
], MotorcycleInput.prototype, "manufacturingYear", void 0);
export class CreateBookingDto {
    customer;
    motorcycle;
    serviceIds;
    date;
    time;
    customerNote;
}
__decorate([
    ValidateNested(),
    Type(() => CustomerInput),
    __metadata("design:type", CustomerInput)
], CreateBookingDto.prototype, "customer", void 0);
__decorate([
    ValidateNested(),
    Type(() => MotorcycleInput),
    __metadata("design:type", MotorcycleInput)
], CreateBookingDto.prototype, "motorcycle", void 0);
__decorate([
    IsArray(),
    ArrayMinSize(1),
    ArrayMaxSize(10),
    ArrayUnique(),
    IsUUID(undefined, { each: true }),
    __metadata("design:type", Array)
], CreateBookingDto.prototype, "serviceIds", void 0);
__decorate([
    Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "date", void 0);
__decorate([
    Matches(TIME_PATTERN, { message: 'time must be HH:mm (24-hour)' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "time", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "customerNote", void 0);
export class AdminCreateBookingDto extends CreateBookingDto {
    internalNote;
    allowOverCapacity;
}
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], AdminCreateBookingDto.prototype, "internalNote", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], AdminCreateBookingDto.prototype, "allowOverCapacity", void 0);
export class TrackBookingDto {
    bookingRef;
    phone;
}
__decorate([
    Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value)),
    Matches(/^SJB-\d{6}-[A-Z0-9]{4}$/, { message: 'Booking reference looks incorrect' }),
    __metadata("design:type", String)
], TrackBookingDto.prototype, "bookingRef", void 0);
__decorate([
    IsString(),
    Length(10, 20),
    __metadata("design:type", String)
], TrackBookingDto.prototype, "phone", void 0);
export class ChangeStatusDto {
    status;
    note;
}
__decorate([
    IsEnum(BookingStatus),
    __metadata("design:type", String)
], ChangeStatusDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(300),
    __metadata("design:type", String)
], ChangeStatusDto.prototype, "note", void 0);
export class RescheduleDto {
    date;
    time;
    allowOverCapacity;
}
__decorate([
    Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], RescheduleDto.prototype, "date", void 0);
__decorate([
    Matches(TIME_PATTERN, { message: 'time must be HH:mm (24-hour)' }),
    __metadata("design:type", String)
], RescheduleDto.prototype, "time", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], RescheduleDto.prototype, "allowOverCapacity", void 0);
export class AssignMechanicDto {
    mechanicId;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], AssignMechanicDto.prototype, "mechanicId", void 0);
export class ListBookingsQuery {
    page = 1;
    limit = 20;
    q;
    status;
    date;
    serviceId;
}
__decorate([
    IsOptional(),
    Transform(({ value }) => Number(value)),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ListBookingsQuery.prototype, "page", void 0);
__decorate([
    IsOptional(),
    Transform(({ value }) => Number(value)),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], ListBookingsQuery.prototype, "limit", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(60),
    __metadata("design:type", String)
], ListBookingsQuery.prototype, "q", void 0);
__decorate([
    IsOptional(),
    IsEnum(BookingStatus),
    __metadata("design:type", String)
], ListBookingsQuery.prototype, "status", void 0);
__decorate([
    IsOptional(),
    Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], ListBookingsQuery.prototype, "date", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], ListBookingsQuery.prototype, "serviceId", void 0);
//# sourceMappingURL=bookings.dto.js.map