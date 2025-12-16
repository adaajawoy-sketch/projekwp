import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }
}