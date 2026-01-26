import { createZodDto } from 'nestjs-zod';
import { UpdateProductSchema } from '@contracts/schemas/products';

export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
