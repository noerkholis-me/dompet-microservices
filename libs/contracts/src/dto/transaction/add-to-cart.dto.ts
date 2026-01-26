import { createZodDto } from 'nestjs-zod';
import { AddToCartSchema } from '@contracts/schemas/transaction';

export class AddToCartDto extends createZodDto(AddToCartSchema) {}
