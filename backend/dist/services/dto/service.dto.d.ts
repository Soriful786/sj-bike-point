export declare class CreateServiceDto {
    categoryId: string;
    name: string;
    description: string;
    imageUrl?: string;
    basePricePaise: number;
    estimatedDurationMin: number;
    isFeatured?: boolean;
    isOnlineBookable?: boolean;
}
declare const UpdateServiceDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateServiceDto>>;
export declare class UpdateServiceDto extends UpdateServiceDto_base {
    isActive?: boolean;
}
export declare class ListServicesQuery {
    page?: number;
    limit?: number;
    q?: string;
    categoryId?: string;
    isActive?: boolean;
}
export declare class PublicServicesQuery {
    category?: string;
    featured?: boolean;
}
export {};
