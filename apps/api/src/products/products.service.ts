
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany();
  }

  create(data: { name: string; description: string; price: number }) {
    return this.prisma.product.create({
      data: {
        ...data,
        price: data.price,
      },
    });
  }
}
