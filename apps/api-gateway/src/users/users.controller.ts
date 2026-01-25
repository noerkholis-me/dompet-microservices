import { CreateUserDto } from '@common/dto/users/create-user.dto';
import { UpdateUserDto } from '@common/dto/users/update-user.dto';
import { User } from '@contracts/generated/auth-services.types';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@Controller('api/users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async getAll() {
    return (
      await firstValueFrom(
        this.http.get<User[]>('http://rbac-service:3000/users', {
          headers: {
            'X-INTERNAL-KEY': this.configService.get<string>('INTERNAL_API_KEY'),
          },
        }),
      )
    ).data;
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  async create(@Body() dto: CreateUserDto) {
    return (
      await firstValueFrom(
        this.http.post<User>('http://rbac-service:3000/users', dto, {
          headers: {
            'X-INTERNAL-KEY': this.configService.get<string>('INTERNAL_API_KEY'),
          },
        }),
      )
    ).data;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return (
      await firstValueFrom(
        this.http.put<User>(`http://rbac-service:3000/users/${id}`, dto, {
          headers: {
            'X-INTERNAL-KEY': this.configService.get<string>('INTERNAL_API_KEY'),
          },
        }),
      )
    ).data;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async delete(@Param('id') id: string) {
    return (
      await firstValueFrom(
        this.http.delete<{ message: string }>(`http://rbac-service:3000/users/${id}`, {
          headers: {
            'X-INTERNAL-KEY': this.configService.get<string>('INTERNAL_API_KEY'),
          },
        }),
      )
    ).data;
  }
}
