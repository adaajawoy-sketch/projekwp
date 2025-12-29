import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products') // Alamatnya: localhost:3000/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Endpoint: POST /products (Untuk nambah data)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    // Controller terima data -> Oper ke Service
    return this.productsService.create(createProductDto);
  }

  // Endpoint: GET /products (Untuk lihat data)
  @Get()
  findAll() {
    // Controller terima request -> Minta data ke Service
    return this.productsService.findAll();
  }

  // Endpoint: GET /products/:id (Untuk lihat data by id)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // Endpoint: PUT /products/:id (Untuk update data)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  // Endpoint: DELETE /products/:id (Untuk hapus data)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}