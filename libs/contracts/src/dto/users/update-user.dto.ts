import { createZodDto } from 'nestjs-zod';
import { UpdateUserSchema } from '@contracts/schemas/users';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
