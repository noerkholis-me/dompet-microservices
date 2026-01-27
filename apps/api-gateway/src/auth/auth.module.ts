import { JwtStrategy } from '@common/strategies';
import { JwtAuthGuard } from '@common/guards';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CommonService } from '@common/common.service';

@Module({
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard, AuthService, CommonService],
})
export class AuthModule {}
