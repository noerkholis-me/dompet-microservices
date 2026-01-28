import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CommonService } from '@common/common.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, CommonService],
})
export class ProductsModule {}
