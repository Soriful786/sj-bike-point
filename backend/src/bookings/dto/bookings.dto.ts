import { BookingStatus, MotorcycleType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { DATE_PATTERN, TIME_PATTERN } from '../../common/utils/time.js';

export class CustomerInput {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsString()
  @Length(10, 20)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class MotorcycleInput {
  @IsString()
  @Length(2, 50)
  brand!: string;

  @IsString()
  @Length(1, 50)
  model!: string;

  @IsString()
  @Length(4, 20)
  registrationNumber!: string;

  @IsOptional()
  @IsEnum(MotorcycleType)
  type?: MotorcycleType;

  @IsOptional()
  @IsInt()
  @Min(1980)
  @Max(2100)
  manufacturingYear?: number;
}

export class CreateBookingDto {
  @ValidateNested()
  @Type(() => CustomerInput)
  customer!: CustomerInput;

  @ValidateNested()
  @Type(() => MotorcycleInput)
  motorcycle!: MotorcycleInput;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  serviceIds!: string[];

  @Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' })
  date!: string;

  @Matches(TIME_PATTERN, { message: 'time must be HH:mm (24-hour)' })
  time!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  customerNote?: string;
}

export class AdminCreateBookingDto extends CreateBookingDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  internalNote?: string;

  @IsOptional()
  @IsBoolean()
  allowOverCapacity?: boolean;
}

export class TrackBookingDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @Matches(/^SJB-\d{6}-[A-Z0-9]{4}$/, { message: 'Booking reference looks incorrect' })
  bookingRef!: string;

  @IsString()
  @Length(10, 20)
  phone!: string;
}

export class ChangeStatusDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string;
}

export class RescheduleDto {
  @Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' })
  date!: string;

  @Matches(TIME_PATTERN, { message: 'time must be HH:mm (24-hour)' })
  time!: string;

  @IsOptional()
  @IsBoolean()
  allowOverCapacity?: boolean;
}

export class AssignMechanicDto {
  @IsUUID()
  mechanicId!: string;
}

export class ListBookingsQuery {
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
  @MaxLength(60)
  q?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' })
  date?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;
}