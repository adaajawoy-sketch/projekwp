import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Buat Order Baru (Lengkap dengan item)
  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        customerId: createOrderDto.customerId,
        customerName: createOrderDto.customerName,
        email: createOrderDto.email,
        phone: createOrderDto.phone,
        address: createOrderDto.address,
        paymentMethod: createOrderDto.paymentMethod,
        totalPrice: createOrderDto.totalPrice,
        items: {
          create: createOrderDto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
  }

  // Ambil Semua
  async findAll() {
    return this.prisma.order.findMany({
      include: { 
        customer: true,
        items: { include: { product: true } } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Ambil Satu
  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { 
        customer: true,
        items: { include: { product: true } } 
      },
    });
  }

  

  // Update Status
  async updateStatus(id: number, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}