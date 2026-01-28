import { LoginSchema } from '@contracts/schemas/auth';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto extends createZodDto(LoginSchema) {
  @ApiProperty({ example: 'admin@dompet.com', description: 'Email' })
  email: string;

  @ApiProperty({ example: 'admin123', description: 'Password' })
  password: string;
}
