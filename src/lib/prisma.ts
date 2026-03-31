import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
    // Prisma 7 should pick up DATABASE_URL from the environment or prisma.config.ts
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
