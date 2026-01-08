import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number) // ✨ Ini sihirnya: ubah teks jadi angka otomatis
  price: number;

  @IsString()
  image: string;
}