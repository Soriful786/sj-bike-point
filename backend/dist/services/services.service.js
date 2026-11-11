var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { uniqueSlug } from '../common/utils/slug.js';
const publicSelect = {
    id: true,
    name: true,
    slug: true,
    description: true,
    imageUrl: true,
    basePricePaise: true,
    estimatedDurationMin: true,
    isFeatured: true,
    isOnlineBookable: true,
    category: { select: { name: true, slug: true } },
};
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listPublic(query) {
        return this.prisma.service.findMany({
            where: {
                isActive: true,
                category: { isActive: true, ...(query.category ? { slug: query.category } : {}) },
                ...(query.featured ? { isFeatured: true } : {}),
            },
            orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
            select: publicSelect,
        });
    }
    async getPublicBySlug(slug) {
        const service = await this.prisma.service.findFirst({
            where: { slug, isActive: true, category: { isActive: true } },
            select: publicSelect,
        });
        if (!service)
            throw new NotFoundException('Service not found');
        return service;
    }
    async listAdmin(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = {
            ...(query.categoryId ? { categoryId: query.categoryId } : {}),
            ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
            ...(query.q ? { name: { contains: query.q, mode: 'insensitive' } } : {}),
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.service.findMany({
                where,
                include: { category: { select: { id: true, name: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.service.count({ where }),
        ]);
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getAdmin(id) {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!service)
            throw new NotFoundException('Service not found');
        return service;
    }
    async create(dto) {
        await this.assertCategoryExists(dto.categoryId);
        const slug = await uniqueSlug(dto.name, async (s) => !!(await this.prisma.service.findUnique({ where: { slug: s } })));
        return this.prisma.service.create({ data: { ...dto, slug } });
    }
    async update(id, dto) {
        await this.getAdmin(id);
        if (dto.categoryId)
            await this.assertCategoryExists(dto.categoryId);
        return this.prisma.service.update({ where: { id }, data: dto });
    }
    async setActive(id, isActive) {
        await this.getAdmin(id);
        return this.prisma.service.update({ where: { id }, data: { isActive } });
    }
    async assertCategoryExists(categoryId) {
        const category = await this.prisma.serviceCategory.findUnique({
            where: { id: categoryId },
        });
        if (!category)
            throw new BadRequestException('Category does not exist');
    }
};
ServicesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ServicesService);
export { ServicesService };
//# sourceMappingURL=services.service.js.map