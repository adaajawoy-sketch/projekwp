import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto'; // Nanti kita buat DTO ini
import { LoginDto } from './dto/login.dto'; // Nanti kita buat DTO ini

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. REGISTER (DAFTAR BARU)
  async register(createAuthDto: CreateAuthDto) {
    const { email, password, name } = createAuthDto;
    
    // Hash password biar aman
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER', // Default user biasa
      },
    });
  }

  // 2. LOGIN (MASUK)
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Cari user
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Email tidak ditemukan');

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Password salah');

    // Bikin Tiket (Token)
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, role: user.role }
    };
  }
}