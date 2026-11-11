import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServiceDto, ListServicesQuery, PublicServicesQuery, UpdateServiceDto } from './dto/service.dto.js';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listPublic(query: PublicServicesQuery): Prisma.PrismaPromise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        imageUrl: string | null;
        basePricePaise: number;
        estimatedDurationMin: number;
        isFeatured: boolean;
        isOnlineBookable: boolean;
        category: {
            name: string;
            slug: string;
        };
    }[]>;
    getPublicBySlug(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        imageUrl: string | null;
        basePricePaise: number;
        estimatedDurationMin: number;
        isFeatured: boolean;
        isOnlineBookable: boolean;
        category: {
            name: string;
            slug: string;
        };
    }>;
    listAdmin(query: ListServicesQuery): Promise<{
        items: ({
            category: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            slug: string;
            categoryId: string;
            description: string;
            imageUrl: string | null;
            basePricePaise: number;
            estimatedDurationMin: number;
            isFeatured: boolean;
            isOnlineBookable: boolean;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAdmin(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        categoryId: string;
        description: string;
        imageUrl: string | null;
        basePricePaise: number;
        estimatedDurationMin: number;
        isFeatured: boolean;
        isOnlineBookable: boolean;
    }>;
    create(dto: CreateServiceDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        categoryId: string;
        description: string;
        imageUrl: string | null;
        basePricePaise: number;
        estimatedDurationMin: number;
        isFeatured: boolean;
        isOnlineBookable: boolean;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        categoryId: string;
        description: string;
        imageUrl: string | null;
        basePricePaise: number;
        estimatedDurationMin: number;
        isFeatured: boolean;
        isOnlineBookable: boolean;
    }>;
    setActive(id: string, isActive: boolean): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        categoryId: string;
        description: string;
        imageUrl: string | null;
        basePricePaise: number;
        estimatedDurationMin: number;
        isFeatured: boolean;
        isOnlineBookable: boolean;
    }>;
    private assertCategoryExists;
}
