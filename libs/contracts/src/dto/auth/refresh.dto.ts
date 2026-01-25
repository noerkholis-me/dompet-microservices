import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ example: 'copy token after login', description: 'Refresh Token' })
  @IsNotEmpty()
  refreshToken: string;
}
