import { PrismaClient } from '@prisma/client';

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
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
}
