import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from '@contracts/dto/products';
import { UpdateProductDto } from '@contracts/dto/products';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    return product;
  }

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { name: dto.name } });
    if (product) throw new ConflictException('Nama produk sudah ada');

    return this.prisma.product.create({
      data: {
        ...dto,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Produk tidak ditemukan');

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async delete(id: string) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Produk tidak ditemukan');

    await this.prisma.product.delete({ where: { id } });
  }
}
