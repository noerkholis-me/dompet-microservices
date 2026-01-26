import { LoginSchema } from '@contracts/schemas/auth';
import { createZodDto } from 'nestjs-zod';

export class LoginDto extends createZodDto(LoginSchema) {}
