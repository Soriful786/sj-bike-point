var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { PublicCategoriesController, ServiceCategoriesController, } from './service-categories.controller.js';
import { ServiceCategoriesService } from './service-categories.service.js';
let ServiceCategoriesModule = class ServiceCategoriesModule {
};
ServiceCategoriesModule = __decorate([
    Module({
        controllers: [PublicCategoriesController, ServiceCategoriesController],
        providers: [ServiceCategoriesService],
        exports: [ServiceCategoriesService],
    })
], ServiceCategoriesModule);
export { ServiceCategoriesModule };
//# sourceMappingURL=service-categories.module.js.map