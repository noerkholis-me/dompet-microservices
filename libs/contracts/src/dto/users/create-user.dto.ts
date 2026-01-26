import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from '@contracts/schemas/users';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
