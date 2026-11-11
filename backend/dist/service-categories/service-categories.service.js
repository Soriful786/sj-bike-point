var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { uniqueSlug } from '../common/utils/slug.js';
let ServiceCategoriesService = class ServiceCategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listPublic() {
        return this.prisma.serviceCategory.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            select: { id: true, name: true, slug: true },
        });
    }
    listAll() {
        return this.prisma.serviceCategory.findMany({
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { services: true } } },
        });
    }
    async create(dto) {
        const taken = await this.prisma.serviceCategory.findUnique({ where: { name: dto.name } });
        if (taken)
            throw new ConflictException('A category with this name already exists');
        const slug = await uniqueSlug(dto.name, async (s) => !!(await this.prisma.serviceCategory.findUnique({ where: { slug: s } })));
        return this.prisma.serviceCategory.create({ data: { ...dto, slug } });
    }
    async update(id, dto) {
        await this.getOrThrow(id);
        if (dto.name) {
            const taken = await this.prisma.serviceCategory.findFirst({
                where: { name: dto.name, NOT: { id } },
            });
            if (taken)
                throw new ConflictException('A category with this name already exists');
        }
        return this.prisma.serviceCategory.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.getOrThrow(id);
        const inUse = await this.prisma.service.count({ where: { categoryId: id } });
        if (inUse > 0) {
            throw new ConflictException('This category has services. Deactivate it instead of deleting it.');
        }
        await this.prisma.serviceCategory.delete({ where: { id } });
        return { message: 'Category deleted' };
    }
    async getOrThrow(id) {
        const found = await this.prisma.serviceCategory.findUnique({ where: { id } });
        if (!found)
            throw new NotFoundException('Category not found');
        return found;
    }
};
ServiceCategoriesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ServiceCategoriesService);
export { ServiceCategoriesService };
//# sourceMappingURL=service-categories.service.js.map