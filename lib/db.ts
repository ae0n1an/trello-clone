import { PrismaClient } from "@prisma/client";

// global is excluded from hot reload
declare global {
    var prisma: PrismaClient | undefined;
}

// initialize new prisma client if global this does not exist
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === "production") globalThis.prisma = db;