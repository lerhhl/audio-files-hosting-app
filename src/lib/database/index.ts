import { POSTGRES_CONNECTION_STRING } from "@/app/config";
import { PrismaClient } from "@/generated/prisma/client";
import { CreateAudioFileInput, UpdateUserInput } from "@/lib/types";
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

export async function findUserById(id: number) {
  return await db.user.findUnique({
    where: { id },
  });
}

export async function getAllUsers(offset = 0, limit = 20) {
  const users = await db.user.findMany({
    orderBy: { id: "asc" },
    skip: offset,
    take: limit,
    select: {
      id: true,
      username: true,
      createdAt: true,
      isAdmin: true,
    },
  });

  const totalUsers = await db.user.count({});

  return {
    items: users,
    totalCount: totalUsers,
  };
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

export async function deleteUser(userId: number) {
  return await db.user.delete({
    where: { id: userId },
  });
}

export async function updateUser({
  userId,
  newUsername,
  newPassword,
}: UpdateUserInput) {
  const data: { password?: string; username?: string } = {};

  if (newPassword) {
    data.password = newPassword;
  }

  if (newUsername) {
    data.username = newUsername;
  }

  return await db.user.update({
    where: { id: userId },
    data,
  });
}

export async function getAllAudioFilesByUserid(
  userId: number,
  offset = 0,
  limit = 20
) {
  const audioFiles = await db.audioFile.findMany({
    where: { createdBy: userId },
    orderBy: { id: "asc" },
    skip: offset,
    take: limit,
    select: {
      id: true,
      description: true,
      category: true,
      mimeType: true,
      createdAt: true,
    },
  });

  const totalAudioFiles = await db.audioFile.count({
    where: { createdBy: userId },
  });

  return {
    items: audioFiles,
    totalCount: totalAudioFiles,
  };
}

export async function createAudioFileRecord({
  description,
  category,
  mimeType,
  filePath,
  userId,
}: CreateAudioFileInput) {
  return await db.audioFile.create({
    data: {
      description,
      category,
      mimeType,
      filePath,
      createdBy: userId,
    },
  });
}

export async function getAudioFileById(id: number) {
  return await db.audioFile.findUnique({
    where: { id },
    select: {
      id: true,
      description: true,
      category: true,
      mimeType: true,
      filePath: true,
      createdBy: true,
      createdAt: true,
    },
  });
}
