import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @IsUUID()
  categoryId!: string;

  @IsString()
  @Length(2, 120)
  name!: string;

  @IsString()
  @Length(10, 2000)
  description!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @IsInt()
  @Min(0)
  @Max(100_000_000) // paise
  basePricePaise!: number;

  @IsInt()
  @Min(15)
  @Max(1440)
  estimatedDurationMin!: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isOnlineBookable?: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ListServicesQuery {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;
}

export class PublicServicesQuery {
  @IsOptional()
  @IsString()
  category?: string; // category slug

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;
}