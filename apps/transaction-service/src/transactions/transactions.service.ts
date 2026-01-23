import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AddToCartDto } from '@contracts/dto/transaction/add-to-cart.dto';
import { Product } from 'apps/data-master-service/src/generated/prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
    private configService: ConfigService,
  ) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    const productRes = await firstValueFrom(
      this.http.get<Product>(`http://api-gateway:3000/api/products/${dto.productId}`, {
        headers: { 'X-INTERNAL-KEY': this.configService.get<string>('INTERNAL_API_KEY') },
      }),
    );

    const product = productRes.data;
    if (!product) throw new NotFoundException('Produk tidak ditemukan');

    return await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: {
          pembeliId: userId,
          status: 'BELUM_DIBAYAR',
          expiredAt: { gt: new Date() },
        },
        include: { items: true },
      });

      if (!transaction) {
        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + 1);

        return await tx.transaction.create({
          data: {
            kodeBilling: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            pembeliId: userId,
            totalHarga: 0,
            expiredAt,
          },
        });
      }

      if (!transaction) throw new BadRequestException('Transaksi gagal, lakukan pembayaran ulang');

      const hargaItem = product.harga * dto.quantity;

      await this.prisma.cartItem.create({
        data: {
          transactionId: transaction.id,
          productId: dto.productId,
          harga: hargaItem,
        },
      });

      const newTotal = transaction.totalHarga + hargaItem;
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { totalHarga: newTotal },
      });

      return { message: 'Item ditambahkan ke cart', transactionId: transaction.id };
    });
  }

  async getCart(userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        pembeliId: userId,
        status: 'BELUM_DIBAYAR',
        expiredAt: { gt: new Date() },
      },
      include: { items: true },
    });

    if (!transaction) return { items: [], total: 0 };

    return {
      items: transaction.items,
      total: transaction.totalHarga,
      expiredAt: transaction.expiredAt,
    };
  }

  async checkout(userId: string) {
    const cart = await this.getCart(userId);
    if (cart.items.length === 0) throw new BadRequestException('Cart kosong');

    const transaction = await this.prisma.transaction.findFirst({
      where: { pembeliId: userId, status: 'BELUM_DIBAYAR' },
    });

    if (!transaction) throw new NotFoundException('Cart tidak ditemukan');

    return {
      kodeBilling: transaction.kodeBilling,
      totalHarga: transaction.totalHarga,
      expiredAt: transaction.expiredAt,
      message: 'Checkout berhasil, silakan lakukan pembayaran',
    };
  }

  async pay(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new NotFoundException('Transaksi tidak ditemukan');
    if (transaction.status === 'SUDAH_DIBAYAR') throw new BadRequestException('Sudah dibayar');
    if (new Date() > transaction.expiredAt) throw new BadRequestException('Transaksi expired');

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'SUDAH_DIBAYAR' },
    });

    return { message: 'Pembayaran berhasil', kodeBilling: transaction.kodeBilling };
  }

  async getHistory(userId: string) {
    return this.prisma.transaction.findMany({
      where: { pembeliId: userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
