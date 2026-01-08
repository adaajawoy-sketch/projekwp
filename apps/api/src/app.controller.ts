import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() { return this.appService.getHello(); }

  // --- PRODUK ---
  @Get('products')
  getProducts() { return this.appService.products(); }

  @Post('products')
  createProduct(@Body() body: any) { return this.appService.createProduct(body); }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) { return this.appService.deleteProduct(id); }

  // --- LAINNYA ---
  @Get('stats')
  getStats() { return this.appService.getDashboardStats(); }

  @Get('comments')
  getComments() { return this.appService.getComments(); }

  @Post('comments')
  createComment(@Body() body: any) { return this.appService.createComment(body); }

  // 👇 ENDPOINT HAPUS KOMENTAR
  @Delete('comments/:id')
  deleteComment(@Param('id') id: string) {
    return this.appService.deleteComment(id);
  }

  @Post('chat')
  chat(@Body() body: { message: string }) { return this.appService.chatWithAI(body.message); }

  @Post('auth/register')
  async register(@Body() body: any) {
    try { return await this.appService.registerCustomer(body); } 
    catch (e) { return { error: e.message }; }
  }

  @Post('auth/login')
  async login(@Body() body: any) {
    try { return await this.appService.loginCustomer(body); } 
    catch (e) { return { error: e.message }; }
  }
}