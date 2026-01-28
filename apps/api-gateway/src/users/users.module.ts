import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CommonService } from '@common/common.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CommonService],
})
export class UsersModule {}
