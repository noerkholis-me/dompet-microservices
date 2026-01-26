import { CheckoutSchema } from '@contracts/schemas/transaction';
import { createZodDto } from 'nestjs-zod';

export class CheckoutDto extends createZodDto(CheckoutSchema) {}
