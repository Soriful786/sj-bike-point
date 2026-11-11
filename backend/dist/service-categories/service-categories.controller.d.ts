import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
import { ServiceCategoriesService } from './service-categories.service.js';
export declare class PublicCategoriesController {
    private readonly categories;
    constructor(categories: ServiceCategoriesService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        slug: string;
    }[]>;
}
export declare class ServiceCategoriesController {
    private readonly categories;
    constructor(categories: ServiceCategoriesService);
    list(): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            services: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
    })[]>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
