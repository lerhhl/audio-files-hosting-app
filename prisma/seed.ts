import { encodePassword } from "@/lib/utils";
import { Prisma, PrismaClient } from "../src/generated/prisma";

export async function main() {
  const prisma = new PrismaClient();

  // Check if the username existing
  const existingUser = await prisma.user.findUnique({
    where: { username: "admin" },
  });
  if (existingUser) {
    console.log("Admin user already exists. Skipping creation.");
    return;
  }

  const encodedPassword = await encodePassword("admin123");
  const userData: Prisma.UserCreateInput = {
    username: "admin",
    password: encodedPassword,
    isAdmin: true,
  };
  await prisma.user.create({ data: userData });
}

main();
