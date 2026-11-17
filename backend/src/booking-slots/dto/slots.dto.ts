import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { DATE_PATTERN, TIME_PATTERN } from '../../common/utils/time.js';

export class AvailabilityQuery {
  @Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' })
  date!: string;
}

export class UpdateGarageSettingsDto {
  @IsOptional()
  @Matches(TIME_PATTERN, { message: 'openingTime must be HH:mm (24-hour)' })
  openingTime?: string;

  @IsOptional()
  @Matches(TIME_PATTERN, { message: 'closingTime must be HH:mm (24-hour)' })
  closingTime?: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(240)
  slotLengthMin?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  capacityPerSlot?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  weeklyOffDays?: number[]; // 0 = Sunday ... 5 = Friday ... 6 = Saturday

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  advanceBookingDays?: number;
}

export class CreateSlotOverrideDto {
  @Matches(DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' })
  date!: string;

  @IsOptional()
  @Matches(TIME_PATTERN, { message: 'startTime must be HH:mm (24-hour)' })
  startTime?: string; // leave out to apply to the whole day

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  capacity?: number;

  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;
}