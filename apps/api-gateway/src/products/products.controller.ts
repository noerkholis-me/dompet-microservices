import { CreateProductDto } from '@common/dto/products/create-product.dto';
import { UpdateUserDto } from '@common/dto/users/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from 'apps/data-master-service/src/generated/prisma/client';
import { firstValueFrom } from 'rxjs';

@Controller('api/products')
@ApiTags('Products')
@ApiBearerAuth()
export class ProductsController {
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
        this.http.get<Product[]>('http://data-master-service:3000/products', {
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
  async create(@Body() dto: CreateProductDto) {
    return (
      await firstValueFrom(
        this.http.post<Product>('http://data-master-service:3000/products', dto, {
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
        this.http.put<Product>(`http://data-master-service:3000/products/${id}`, dto, {
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
        this.http.delete<{ message: string }>(`http://data-master-service:3000/products/${id}`, {
          headers: {
            'X-INTERNAL-KEY': this.configService.get<string>('INTERNAL_API_KEY'),
          },
        }),
      )
    ).data;
  }
}
