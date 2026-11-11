import { CreateServiceDto, ListServicesQuery, PublicServicesQuery, UpdateServiceDto } from './dto/service.dto.js';
import { ServicesService } from './services.service.js';
declare class SetActiveDto {
    isActive: boolean;
}
export declare class PublicServicesController {
    private readonly services;
    constructor(services: ServicesService);
    list(query: PublicServicesQuery): import("@prisma/client").Prisma.PrismaPromise<{
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
    getOne(slug: string): Promise<{
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
}
export declare class ServicesController {
    private readonly services;
    constructor(services: ServicesService);
    list(query: ListServicesQuery): Promise<{
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
    getOne(id: string): Promise<{
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
    setStatus(id: string, dto: SetActiveDto): Promise<{
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
}
export {};
