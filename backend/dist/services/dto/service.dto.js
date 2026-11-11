var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, IsUUID, Length, Max, Min, } from 'class-validator';
export class CreateServiceDto {
    categoryId;
    name;
    description;
    imageUrl;
    basePricePaise;
    estimatedDurationMin;
    isFeatured;
    isOnlineBookable;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "categoryId", void 0);
__decorate([
    IsString(),
    Length(2, 120),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    IsString(),
    Length(10, 2000),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsUrl({ require_tld: false }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "imageUrl", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(100_000_000),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "basePricePaise", void 0);
__decorate([
    IsInt(),
    Min(15),
    Max(1440),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "estimatedDurationMin", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateServiceDto.prototype, "isFeatured", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateServiceDto.prototype, "isOnlineBookable", void 0);
export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    isActive;
}
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateServiceDto.prototype, "isActive", void 0);
export class ListServicesQuery {
    page = 1;
    limit = 20;
    q;
    categoryId;
    isActive;
}
__decorate([
    IsOptional(),
    Transform(({ value }) => Number(value)),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ListServicesQuery.prototype, "page", void 0);
__decorate([
    IsOptional(),
    Transform(({ value }) => Number(value)),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], ListServicesQuery.prototype, "limit", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ListServicesQuery.prototype, "q", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], ListServicesQuery.prototype, "categoryId", void 0);
__decorate([
    IsOptional(),
    Transform(({ value }) => value === 'true'),
    IsBoolean(),
    __metadata("design:type", Boolean)
], ListServicesQuery.prototype, "isActive", void 0);
export class PublicServicesQuery {
    category;
    featured;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], PublicServicesQuery.prototype, "category", void 0);
__decorate([
    IsOptional(),
    Transform(({ value }) => value === 'true'),
    IsBoolean(),
    __metadata("design:type", Boolean)
], PublicServicesQuery.prototype, "featured", void 0);
//# sourceMappingURL=service.dto.js.map