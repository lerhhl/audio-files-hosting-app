"use server";

import { USERS_MANAGEMENT_PATH } from "@/app/constants";
import { CreateUserFormState } from "@/components/types";
import {
  createUser,
  deleteUser,
  findUserByUsername,
  getAllUsers,
} from "@/lib/database";
import { CreateUserFormSchema } from "@/lib/formDefinitions";
import { revalidatePath } from "next/cache";

export async function getAllUsersAction() {
  try {
    const users = await getAllUsers();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function createUserAction(
  _state: CreateUserFormState,
  formData: FormData
): Promise<CreateUserFormState> {
  try {
    console.log("creating user...");
    // Validate form fields
    const validatedFields = CreateUserFormSchema.safeParse({
      username: formData.get("username"),
      password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return {
        success: false,
        errors,
      };
    }

    // 2. Prepare data for insertion into database
    const { username, password } = validatedFields.data;

    // Check if the user already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return {
        success: false,
        errors: {
          username: ["Username already exists"],
        },
      } as CreateUserFormState;
    }

    // e.g. Hash the user's password before storing it
    const encoder = new TextEncoder();
    const encodedPassword = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedPassword);
    const hashedPassword = Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    console.log("Inserting user into database:", {
      username,
    });

    // 3. Insert the user into the database
    const newUser = await createUser({
      username,
      hashedPassword: hashedPassword,
    });

    console.log("New user created");

    if (!newUser) {
      return {
        success: false,
        message: "Failed to create user",
      };
    }

    revalidatePath(USERS_MANAGEMENT_PATH);

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error creating user:", error);

    return {
      success: false,
      errors: {
        server: "An error occurred while creating the user. Please try again.",
      },
    } as CreateUserFormState;
  }
}

export async function deleteUserAction(username: string) {
  try {
    console.log("Deleting user:", username);

    await deleteUser(username);

    console.log(`User ${username} deleted`);

    revalidatePath(USERS_MANAGEMENT_PATH);

    return {
      success: false,
      message: `User ${username} deleted successfully`,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: `Failed to delete user ${username}`,
    };
  }
}
