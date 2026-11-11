import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { uniqueSlug } from '../common/utils/slug.js';
import {
  CreateServiceDto,
  ListServicesQuery,
  PublicServicesQuery,
  UpdateServiceDto,
} from './dto/service.dto.js';

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
} satisfies Prisma.ServiceSelect;

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  // ----- Public -----
  listPublic(query: PublicServicesQuery) {
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

  async getPublicBySlug(slug: string) {
    const service = await this.prisma.service.findFirst({
      where: { slug, isActive: true, category: { isActive: true } },
      select: publicSelect,
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  // ----- Admin -----
  async listAdmin(query: ListServicesQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ServiceWhereInput = {
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

  async getAdmin(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async create(dto: CreateServiceDto) {
    await this.assertCategoryExists(dto.categoryId);
    const slug = await uniqueSlug(dto.name, async (s) =>
      !!(await this.prisma.service.findUnique({ where: { slug: s } })),
    );
    return this.prisma.service.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.getAdmin(id);
    if (dto.categoryId) await this.assertCategoryExists(dto.categoryId);
    // The slug is not changed on rename, so existing links keep working.
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  async setActive(id: string, isActive: boolean) {
    await this.getAdmin(id);
    return this.prisma.service.update({ where: { id }, data: { isActive } });
  }

  private async assertCategoryExists(categoryId: string) {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new BadRequestException('Category does not exist');
  }
}