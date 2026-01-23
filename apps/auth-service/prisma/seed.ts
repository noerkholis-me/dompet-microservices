import { PrismaClient, RoleType } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { Logger } from '@nestjs/common';
import * as argon2 from 'argon2';

const logger = new Logger('SeedAuthServices');
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

async function main() {
  const passwordHash = await hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@dompet.com',
      password: passwordHash,
      roles: {
        create: [{ role: RoleType.ADMIN }],
      },
    },
  });

  logger.log(`Admin user created: ${admin.id}`);
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
