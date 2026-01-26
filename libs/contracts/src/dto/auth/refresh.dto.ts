import { RefreshSchema } from '@contracts/schemas/auth';
import { createZodDto } from 'nestjs-zod';

export class RefreshDto extends createZodDto(RefreshSchema) {}
