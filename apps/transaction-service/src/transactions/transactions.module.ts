import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CommonService } from '@common/common.service';

@Module({
  providers: [TransactionsService, CommonService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
