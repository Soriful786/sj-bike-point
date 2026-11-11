export declare class CreateCategoryDto {
    name: string;
    sortOrder?: number;
}
declare const UpdateCategoryDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCategoryDto>>;
export declare class UpdateCategoryDto extends UpdateCategoryDto_base {
    isActive?: boolean;
}
export {};
