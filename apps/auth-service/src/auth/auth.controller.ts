import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { SuccessMessage } from '@common/decorators/success-message.decorator';
import { LoginDto, RefreshDto } from '@contracts/dto/auth';
import { AuthenticatedUser } from '@contracts/interfaces';
import { InternalGuard } from '@common/guards';

@ApiTags('Auth')
@Controller()
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
  @Post('refresh-token')
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @ApiOperation({ summary: 'Get current user' })
  @UseGuards(InternalGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ description: 'logout' })
  @SuccessMessage('Logout success')
  @UseGuards(InternalGuard)
  @Post('logout')
  logout() {
    return { message: 'Logout success' };
  }
}
