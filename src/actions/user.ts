"use server";

import { getAllUsers } from "@/lib/database";

export async function getAllUsersAction() {
  try {
    const users = await getAllUsers();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
