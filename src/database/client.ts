/**
 * OpenKernel EDU - Prisma Client Singleton
 * Manages database connection with proper singleton pattern
 * 
 * @module database/client
 */

import { PrismaClient } from '@prisma/client';

// Declare global type for singleton in development
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

/**
 * Prisma client singleton
 * In development, we store on globalThis to prevent multiple instances during HMR
 */
export const prisma = globalThis.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

/**
 * Disconnect from database
 */
export async function disconnectDb(): Promise<void> {
    await prisma.$disconnect();
}

/**
 * Check database connection health
 */
export async function checkDbConnection(): Promise<boolean> {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch {
        return false;
    }
}

export default prisma;
