import { PrismaClient } from '@prisma/client';

// Declaramos una variable global tipada para retener la conexión
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Reutilizamos la instancia si ya existe, o creamos una nueva
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

// Si estamos en desarrollo, guardamos la instancia en el objeto global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}