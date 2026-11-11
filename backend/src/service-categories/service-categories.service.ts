import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { uniqueSlug } from '../common/utils/slug.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';

@Injectable()
export class ServiceCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(dto: CreateCategoryDto) {
    const taken = await this.prisma.serviceCategory.findUnique({ where: { name: dto.name } });
    if (taken) throw new ConflictException('A category with this name already exists');

    const slug = await uniqueSlug(dto.name, async (s) =>
      !!(await this.prisma.serviceCategory.findUnique({ where: { slug: s } })),
    );
    return this.prisma.serviceCategory.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.getOrThrow(id);
    if (dto.name) {
      const taken = await this.prisma.serviceCategory.findFirst({
        where: { name: dto.name, NOT: { id } },
      });
      if (taken) throw new ConflictException('A category with this name already exists');
    }
    return this.prisma.serviceCategory.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.getOrThrow(id);
    const inUse = await this.prisma.service.count({ where: { categoryId: id } });
    if (inUse > 0) {
      throw new ConflictException(
        'This category has services. Deactivate it instead of deleting it.',
      );
    }
    await this.prisma.serviceCategory.delete({ where: { id } });
    return { message: 'Category deleted' };
  }

  private async getOrThrow(id: string) {
    const found = await this.prisma.serviceCategory.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Category not found');
    return found;
  }
}