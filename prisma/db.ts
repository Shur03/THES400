import { PrismaClient } from "@prisma/client";

const PrismaClientSingleton = () => {
  return new PrismaClient();
}

declare global {
  var prismaGlobal: ReturnType<typeof PrismaClientSingleton> | undefined;
}

const db = globalThis.prismaGlobal ?? PrismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;

export default db;