import { PrismaClient, TransactionStatus } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { Logger } from '@nestjs/common';

const logger = new Logger('SeedTransactionService');
const connectionString = process.env.DATABASE_URL_TRANSACTION;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  logger.log('Starting seed for Transaction Service...');

  const samplePembeliId = '00000000-0000-0000-0000-000000000001';
  const sampleProductIds = [
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012',
  ];

  const transactions = [
    {
      kodeBilling: 'INV-20260123-001',
      pembeliId: samplePembeliId,
      totalHarga: 16200000,
      status: TransactionStatus.BELUM_DIBAYAR,
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      items: [
        {
          productId: sampleProductIds[0],
          harga: 15000000,
        },
        {
          productId: sampleProductIds[1],
          harga: 1200000,
        },
      ],
    },
    {
      kodeBilling: 'INV-20260123-002',
      pembeliId: samplePembeliId,
      totalHarga: 7500000,
      status: TransactionStatus.SUDAH_DIBAYAR,
      expiredAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      items: [
        {
          productId: sampleProductIds[2],
          harga: 2500000,
        },
        {
          productId: sampleProductIds[0],
          harga: 5000000,
        },
      ],
    },
  ];

  for (const transactionData of transactions) {
    try {
      const { items, ...transactionFields } = transactionData;

      const transaction = await prisma.transaction.upsert({
        where: { kodeBilling: transactionFields.kodeBilling },
        update: {
          ...transactionFields,
          items: {
            deleteMany: {},
            create: items,
          },
        },
        create: {
          ...transactionFields,
          items: {
            create: items,
          },
        },
      });

      logger.log(`Transaction created/updated: ${transaction.kodeBilling} - ID: ${transaction.id}`);
    } catch (error) {
      logger.error(`Failed to create transaction ${transactionData.kodeBilling}:`, error);
    }
  }

  logger.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    logger.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
