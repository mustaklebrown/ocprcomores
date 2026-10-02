import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL ||
    (process.env.DB_USER
      ? `mysql://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASSWORD || '')}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME || 'ocpr_db'}`
      : 'mysql://root:password@127.0.0.1:3306/ocpr_db');

  try {
    const url = new URL(connectionString);
    const databaseName = url.pathname.replace(/^\//, '').split('?')[0];
    const poolSize = process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE, 10) : 10;
    const isSslRequired = url.searchParams.get('ssl') === 'true' || process.env.DB_SSL === 'true';
    const socketPath =
      url.searchParams.get('socket') ||
      process.env.DB_SOCKET ||
      (process.env.MYSQL_UNIX_PORT || undefined);

    const adapterConfig: any = {
      user: decodeURIComponent(url.username || process.env.DB_USER || 'root'),
      password: decodeURIComponent(url.password || process.env.DB_PASSWORD || ''),
      database: databaseName || process.env.DB_NAME || 'ocpr_db',
      connectionLimit: poolSize,
      allowPublicKeyRetrieval: true,
      connectTimeout: 30000,
      acquireTimeout: 30000,
      idleTimeout: 60000,
      charset: 'utf8mb4',
      ...(isSslRequired ? { ssl: { rejectUnauthorized: false } } : {}),
    };

    // Sur cPanel, la connexion peut se faire soit par Unix Socket (/var/lib/mysql/mysql.sock), soit par TCP
    if (socketPath) {
      adapterConfig.socketPath = socketPath;
    } else {
      adapterConfig.host = url.hostname || process.env.DB_HOST || '127.0.0.1';
      adapterConfig.port = parseInt(url.port || process.env.DB_PORT || '3306', 10);
    }

    const adapter = new PrismaMariaDb(adapterConfig);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (err) {
    console.error('⚠️ Erreur lors de l’initialisation de la connexion MySQL (cPanel / Production):', err);
    return new PrismaClient();
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

