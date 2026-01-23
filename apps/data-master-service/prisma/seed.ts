import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { Logger } from '@nestjs/common';

const logger = new Logger('SeedDataMasterService');
const connectionString = process.env.DATABASE_URL_MASTER;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  logger.log('Starting seed for Data Master Service...');

  const products = [
    {
      name: 'Laptop ASUS ROG',
      harga: 15000000,
    },
    {
      name: 'Mouse Logitech MX Master 3',
      harga: 1200000,
    },
    {
      name: 'Keyboard Mechanical RGB',
      harga: 2500000,
    },
    {
      name: 'Monitor LG 27 inch 4K',
      harga: 5000000,
    },
    {
      name: 'Webcam Logitech C920',
      harga: 1500000,
    },
    {
      name: 'Headset SteelSeries Arctis 7',
      harga: 3000000,
    },
    {
      name: 'SSD Samsung 1TB NVMe',
      harga: 2000000,
    },
    {
      name: 'RAM Corsair 16GB DDR4',
      harga: 1800000,
    },
  ];

  for (const product of products) {
    try {
      const created = await prisma.product.upsert({
        where: { name: product.name },
        update: {
          harga: product.harga,
        },
        create: product,
      });
      logger.log(`Product created/updated: ${created.name} - ID: ${created.id}`);
    } catch (error) {
      logger.error(`Failed to create product ${product.name}:`, error);
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
