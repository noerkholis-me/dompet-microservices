import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Module({
  providers: [
    CommonService,
    {
      provide: REQUEST,
      useExisting: Request,
    },
  ],
  exports: [CommonService],
})
export class CommonModule {}
