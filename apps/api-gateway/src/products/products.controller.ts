import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from '@contracts/dto/products';
import { ProductsService } from './products.service';
import { SuccessMessage } from '@common/decorators';

@Controller('api/products')
@ApiTags('Products')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @SuccessMessage('Produk berhasil diambil')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @SuccessMessage('Produk berhasil diambil berdasarkan ID')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Return product by id.' })
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  @SuccessMessage('Produk berhasil ditambahkan')
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Put(':id')
  @SuccessMessage('Produk berhasil diupdate')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @SuccessMessage('Produk berhasil dihapus')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
