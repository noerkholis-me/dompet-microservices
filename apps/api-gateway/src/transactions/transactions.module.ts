import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CommonService } from '@common/common.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, CommonService],
})
export class TransactionsModule {}
