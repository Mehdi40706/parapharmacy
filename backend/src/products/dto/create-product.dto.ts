import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  MinLength,
  IsPositive,
  IsInt,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;


  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  reservedStock?: number;
  
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  usageInstructions?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsUUID()
  categoryId!: string;


}