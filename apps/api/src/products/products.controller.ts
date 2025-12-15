
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from '../auth/public.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  create(@Body() createProductDto: { name: string; description: string; price: number }) {
    return this.productsService.create(createProductDto);
  }
}
