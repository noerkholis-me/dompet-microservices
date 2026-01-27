/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { LoginDto } from '@contracts/dto/auth/login.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RefreshDto } from '@contracts/dto/auth/refresh.dto';
import { JwtAuthGuard } from '@common/guards';

@Controller('api')
export class AuthController {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return (
      await firstValueFrom(
        this.http.post('http://auth-service:3000/login', dto, {
          headers: { 'X-INTERNAL-KEY': this.configService.get<string>('INTERNAL_API_KEY') },
        }),
      )
    ).data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refresh(@Body() dto: RefreshDto) {
    return (
      await firstValueFrom(
        this.http.post('http://auth-service:3000/refresh-token', dto, {
          headers: { 'X-INTERNAL-KEY': this.configService.get<string>('INTERNAL_API_KEY') },
        }),
      )
    ).data;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user (protected)' })
  async me(@Req() req: Request) {
    return (
      await firstValueFrom(
        this.http.get('http://auth-service:3000/me', {
          headers: {
            'X-INTERNAL-KEY': this.configService.get<string>('INTERNAL_API_KEY'),
            Authorization: req.headers?.authorization,
          },
        }),
      )
    ).data;
  }
}
