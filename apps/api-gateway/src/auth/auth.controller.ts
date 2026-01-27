import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from '@contracts/dto/auth/login.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RefreshDto } from '@contracts/dto/auth/refresh.dto';
import { JwtAuthGuard } from '@common/guards';
import { AuthService } from './auth.service';
import { CurrentUser } from '@common/decorators';
import { AuthenticatedUser } from '@contracts/interfaces';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user (protected)' })
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user);
  }
}
