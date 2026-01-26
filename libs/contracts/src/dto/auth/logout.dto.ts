import { createZodDto } from 'nestjs-zod';
import { LogoutSchema } from '../../schemas/auth/logout.schema';

export class LogoutDto extends createZodDto(LogoutSchema) {}
