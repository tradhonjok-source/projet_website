import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Crée une instance PrismaClient configurée avec Prisma Postgres.
 *
 * Prisma Postgres utilise l'URL de connexion DATABASE_URL fournie par Vercel.
 *
 * @example
 * ```ts
 * const prisma = createPrismaClient();
 * await prisma.user.findUnique({ where: { id: 1 } });
 * await prisma.$disconnect();
 * ```
 */
export function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
}
