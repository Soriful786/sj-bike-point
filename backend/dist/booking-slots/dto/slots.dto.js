var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayUnique, IsArray, IsBoolean, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, } from 'class-validator';
import { DATE_PATTERN, TIME_PATTERN } from '../../common/utils/time.js';
export class AvailabilityQuery {
    date;
}
__decorate([
    Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], AvailabilityQuery.prototype, "date", void 0);
export class UpdateGarageSettingsDto {
    openingTime;
    closingTime;
    slotLengthMin;
    capacityPerSlot;
    weeklyOffDays;
    advanceBookingDays;
}
__decorate([
    IsOptional(),
    Matches(TIME_PATTERN, { message: 'openingTime must be HH:mm (24-hour)' }),
    __metadata("design:type", String)
], UpdateGarageSettingsDto.prototype, "openingTime", void 0);
__decorate([
    IsOptional(),
    Matches(TIME_PATTERN, { message: 'closingTime must be HH:mm (24-hour)' }),
    __metadata("design:type", String)
], UpdateGarageSettingsDto.prototype, "closingTime", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(15),
    Max(240),
    __metadata("design:type", Number)
], UpdateGarageSettingsDto.prototype, "slotLengthMin", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(50),
    __metadata("design:type", Number)
], UpdateGarageSettingsDto.prototype, "capacityPerSlot", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    ArrayUnique(),
    IsInt({ each: true }),
    Min(0, { each: true }),
    Max(6, { each: true }),
    __metadata("design:type", Array)
], UpdateGarageSettingsDto.prototype, "weeklyOffDays", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(365),
    __metadata("design:type", Number)
], UpdateGarageSettingsDto.prototype, "advanceBookingDays", void 0);
export class CreateSlotOverrideDto {
    date;
    startTime;
    capacity;
    isClosed;
    reason;
}
__decorate([
    Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], CreateSlotOverrideDto.prototype, "date", void 0);
__decorate([
    IsOptional(),
    Matches(TIME_PATTERN, { message: 'startTime must be HH:mm (24-hour)' }),
    __metadata("design:type", String)
], CreateSlotOverrideDto.prototype, "startTime", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(0),
    Max(50),
    __metadata("design:type", Number)
], CreateSlotOverrideDto.prototype, "capacity", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateSlotOverrideDto.prototype, "isClosed", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(200),
    __metadata("design:type", String)
], CreateSlotOverrideDto.prototype, "reason", void 0);
//# sourceMappingURL=slots.dto.js.map