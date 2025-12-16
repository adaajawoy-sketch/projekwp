import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products') // Alamatnya: localhost:3000/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Endpoint: POST /products (Untuk nambah data)
  @Post()
  create(@Body() body: any) {
    // Controller terima data -> Oper ke Service
    return this.productsService.create(body);
  }

  // Endpoint: GET /products (Untuk lihat data)
  @Get()
  findAll() {
    // Controller terima request -> Minta data ke Service
    return this.productsService.findAll();
  }
}