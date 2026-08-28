import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

/**
 * Crée une instance PrismaClient configurée avec l'adaptateur libsql pour SQLite.
 *
 * Prisma v7 requiert un adaptateur explicite pour SQLite - l'URL directe via
 * `datasources.db.url` n'est plus supportée sans adaptateur.
 *
 * @example
 * ```ts
 * const prisma = createPrismaClient();
 * await prisma.user.findUnique({ where: { id: 1 } });
 * await prisma.$disconnect();
 * ```
 */
export function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  });
  return new PrismaClient({ adapter });
}
