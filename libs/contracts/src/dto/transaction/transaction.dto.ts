import { createZodDto } from 'nestjs-zod';
import { TransactionSchema } from '@contracts/schemas/transaction';

export class TransactionDto extends createZodDto(TransactionSchema) {}
