import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL || 'mysql://root:password@127.0.0.1:3306/ocpr_db';

  try {
    const url = new URL(connectionString);
    const databaseName = url.pathname.replace(/^\//, '').split('?')[0];
    const poolSize = process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE, 10) : 10;
    const isSslRequired = url.searchParams.get('ssl') === 'true' || process.env.DB_SSL === 'true';

    const adapter = new PrismaMariaDb({
      host: url.hostname || '127.0.0.1',
      port: parseInt(url.port || '3306', 10),
      user: decodeURIComponent(url.username || 'root'),
      password: decodeURIComponent(url.password || ''),
      database: databaseName || 'ocpr_db',
      connectionLimit: poolSize,
      allowPublicKeyRetrieval: true,
      connectTimeout: 30000,
      acquireTimeout: 30000,
      idleTimeout: 60000,
      charset: 'utf8mb4',
      ...(isSslRequired ? { ssl: { rejectUnauthorized: false } } : {}),
    });

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (err) {
    console.error('⚠️ Erreur lors de l’initialisation de la connexion MySQL Hostinger:', err);
    return new PrismaClient();
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

