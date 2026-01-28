import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from '@contracts/dto/products';
import { ProductsService } from './products.service';
import { Roles, SuccessMessage } from '@common/decorators';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { UseGuards } from '@nestjs/common';
import { RoleType } from '@contracts/enums';

@Controller('api/products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.PEMBELI)
  @SuccessMessage('Produk berhasil diambil')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.PEMBELI)
  @SuccessMessage('Produk berhasil diambil berdasarkan ID')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Return product by id.' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleType.PEMBELI)
  @SuccessMessage('Produk berhasil ditambahkan')
  @ApiOperation({ summary: 'Create a product by pembeli' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @SuccessMessage('Produk berhasil diupdate')
  @ApiOperation({ summary: 'Update a product by admin' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @SuccessMessage('Produk berhasil dihapus')
  @ApiOperation({ summary: 'Delete a product by admin' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
