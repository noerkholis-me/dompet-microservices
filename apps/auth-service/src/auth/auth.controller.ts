import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { SuccessMessage } from '@common/decorators/success-message.decorator';
import { AuthenticatedUser } from '@common/types/auth.types';
import { LoginDto } from '../../../../libs/common/src/dto/login.dto';
import { JwtAuthGuard } from '../../../../libs/common/src/guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ description: 'login' })
  @SuccessMessage('Login success')
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ description: 'refresh token' })
  @SuccessMessage('Refresh token success')
  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @ApiOperation({ summary: 'Get current user' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ description: 'logout' })
  @SuccessMessage('Logout success')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    return { message: 'Logout success' };
  }
}
