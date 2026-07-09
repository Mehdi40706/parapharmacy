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

  @IsOptional()
  @IsString()
  usageInstructions?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];


  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsUUID()
  categoryId!: string;


}