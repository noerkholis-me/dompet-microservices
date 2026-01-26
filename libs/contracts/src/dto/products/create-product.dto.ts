import { CreateProductSchema } from '@contracts/schemas/products';
import { createZodDto } from 'nestjs-zod';

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
