import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from '@common/dto/login.dto';
import { JwtPayload } from '@common/types/auth.types';
import { ConfigService } from '@nestjs/config';
import { RoleType } from '../generated/prisma/enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: { select: { role: true } } },
    });
    if (!user) throw new UnauthorizedException('Email atau password salah');

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) throw new UnauthorizedException('Email atau password salah');

    const accessToken = await this.generateToken(
      user.id,
      email,
      user.roles.map((role) => role.role),
    );
    const refreshToken = await this.generateRefreshToken(
      user.id,
      email,
      user.roles.map((role) => role.role),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const { sub } = this.jwtService.verify<JwtPayload>(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const user = await this.prisma.user.findUnique({
      where: { id: sub },
      include: { roles: { select: { role: true } } },
    });
    if (!user) throw new UnauthorizedException('Invalid token refresh');

    const accessToken = await this.generateToken(
      user.id,
      user.email,
      user.roles.map((role) => role.role),
    );

    return {
      accessToken,
    };
  }

  private async generateToken(userId: string, email: string, roles: RoleType[]): Promise<string> {
    const payload = { sub: userId, email, roles };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1d',
    });
  }

  private async generateRefreshToken(userId: string, email: string, roles: RoleType[]): Promise<string> {
    const payload = { sub: userId, email, roles };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });
  }
}
