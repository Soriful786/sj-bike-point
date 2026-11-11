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
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
import { ServiceCategoriesService } from './service-categories.service.js';
let PublicCategoriesController = class PublicCategoriesController {
    categories;
    constructor(categories) {
        this.categories = categories;
    }
    list() {
        return this.categories.listPublic();
    }
};
__decorate([
    Public(),
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicCategoriesController.prototype, "list", null);
PublicCategoriesController = __decorate([
    Controller('public/categories'),
    __metadata("design:paramtypes", [ServiceCategoriesService])
], PublicCategoriesController);
export { PublicCategoriesController };
let ServiceCategoriesController = class ServiceCategoriesController {
    categories;
    constructor(categories) {
        this.categories = categories;
    }
    list() {
        return this.categories.listAll();
    }
    create(dto) {
        return this.categories.create(dto);
    }
    update(id, dto) {
        return this.categories.update(id, dto);
    }
    remove(id) {
        return this.categories.remove(id);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceCategoriesController.prototype, "list", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], ServiceCategoriesController.prototype, "create", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER),
    Patch(':id'),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], ServiceCategoriesController.prototype, "update", null);
__decorate([
    Roles(Role.ADMIN, Role.MANAGER),
    Delete(':id'),
    __param(0, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceCategoriesController.prototype, "remove", null);
ServiceCategoriesController = __decorate([
    Controller('service-categories'),
    __metadata("design:paramtypes", [ServiceCategoriesService])
], ServiceCategoriesController);
export { ServiceCategoriesController };
//# sourceMappingURL=service-categories.controller.js.map