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

export async function getAllUsers() {
  return await db.user.findMany({
    select: {
      id: true,
      username: true,
      createdAt: true,
      isAdmin: true,
    },
  });
}

export async function createUser({
  username,
  hashedPassword,
}: {
  username: string;
  hashedPassword: string;
}) {
  return await db.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
}

export async function deleteUser(username: string) {
  return await db.user.delete({
    where: { username },
  });
}

export async function getAllAudioFilesByUsername(username: string) {
  return await db.audioFile.findMany({
    where: { createdBy: username },
    select: {
      id: true,
      description: true,
      codec: true,
      createdAt: true,
    },
  });
}
