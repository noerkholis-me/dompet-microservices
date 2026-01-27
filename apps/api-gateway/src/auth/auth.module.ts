import { JwtStrategy } from '@common/strategies';
import { JwtAuthGuard } from '@common/guards';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
