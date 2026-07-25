let prismaInstance: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient: Client } = require('@prisma/client');
  prismaInstance = (globalThis as any).prismaGlobal ?? new Client({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  if (process.env.NODE_ENV !== 'production') {
    (globalThis as any).prismaGlobal = prismaInstance;
  }
} catch {
  console.warn('Prisma client not yet generated. Running with in-memory store.');
}

export const prisma = prismaInstance;
export default prisma;

