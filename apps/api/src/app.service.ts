import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AppService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private prisma: PrismaService) {
    // Pastikan API KEY ada di .env backend
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  getHello(): string {
    return 'Hello World!';
  }

  // --- 1. PRODUK ---
  async products() {
    return this.prisma.product.findMany({
      orderBy: { id: 'desc' }
    });
  }

  async createProduct(data: any) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        image: data.image,
        description: data.description,
      },
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id: Number(id) },
    });
  }

  // --- 2. STATISTIK ---
  async getDashboardStats() {
    const totalProducts = await this.prisma.product.count();
    const totalOrders = await this.prisma.order.count();
    const salesAggregate = await this.prisma.order.aggregate({
      _sum: { totalPrice: true },
    });

    return {
      totalProducts,
      totalOrders,
      totalSales: salesAggregate._sum.totalPrice || 0,
    };
  }

  // --- 3. KOMENTAR ---
  async getComments() {
    return this.prisma.comment.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createComment(data: any) {
    return this.prisma.comment.create({
      data: { user: data.user, text: data.text },
    });
  }

  // 👇 FITUR HAPUS KOMENTAR
  async deleteComment(id: string) {
    return this.prisma.comment.delete({
      where: { id: Number(id) },
    });
  }

  // --- 4. CHAT COPILOT ---
  async chatWithAI(message: string) {
    const systemPrompt = `Kamu adalah "Askara", penjaga toko NightStalkers. Jawab seputar horor/produk saja. User tanya: ${message}`;
    try {
      const result = await this.model.generateContent(systemPrompt);
      return { reply: result.response.text() };
    } catch (error) {
      return { reply: "Error API..." };
    }
  }

  // --- 5. AUTH CUSTOMER ---
  async registerCustomer(data: any) {
    const existing = await this.prisma.customer.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email sudah terdaftar');
    return this.prisma.customer.create({
      data: { email: data.email, password: data.password, name: data.name },
    });
  }

  async loginCustomer(data: any) {
    const customer = await this.prisma.customer.findUnique({ where: { email: data.email } });
    if (!customer || customer.password !== data.password) throw new Error('Email/Password salah');
    const { password, ...result } = customer;
    return result;
  }
}