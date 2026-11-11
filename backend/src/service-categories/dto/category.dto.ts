import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 80)
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}