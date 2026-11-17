import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
export declare class ServiceCategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listPublic(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        slug: string;
    }[]>;
    listAll(): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            services: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
    })[]>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private getOrThrow;
}
