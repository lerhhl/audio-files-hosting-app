import { POSTGRES_CONNECTION_STRING } from "@/app/config";
import { PrismaClient } from "@/generated/prisma/client";
import "server-only";

if (!POSTGRES_CONNECTION_STRING) {
  throw new Error("POSTGRES_CONNECTION_STRING environment variable not set.");
}

export const db = new PrismaClient({
  datasources: {
    db: {
      url: POSTGRES_CONNECTION_STRING,
    },
  },
});

export async function findUserByUsername(username: string) {
  return await db.user.findFirst({
    where: { username },
  });
}
