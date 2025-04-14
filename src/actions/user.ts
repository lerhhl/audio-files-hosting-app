"use server";

import { USERS_MANAGEMENT_PATH } from "@/app/constants";
import { CreateUserFormState, UpdateUserFormState } from "@/components/types";
import {
  createUser,
  deleteUser,
  findUserById,
  findUserByUsername,
  updateUser,
} from "@/lib/database";
import {
  createUserFormSchema,
  updateUserFormSchema,
} from "@/lib/formDefinitions";
import { logger } from "@/lib/logger";
import { UpdateUserInput } from "@/lib/types";
import { hashPassword } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createUserAction(
  _state: CreateUserFormState,
  formData: FormData
): Promise<CreateUserFormState> {
  try {
    logger.info("creating user...");
    // Validate form fields
    const validatedFields = createUserFormSchema.safeParse({
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

    // Prepare data for insertion into database
    const { username, password } = validatedFields.data;

    // Check if the user already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return {
        success: false,
        errors: {
          username: ["Username already exists"],
        },
      };
    }

    const hashedPassword = await hashPassword(password);

    logger.info({ username }, "Inserting user into database:");

    // 3. Insert the user into the database
    const newUser = await createUser({
      username,
      hashedPassword,
    });

    if (!newUser) {
      return {
        success: false,
        message: "Failed to create user",
      };
    }

    logger.info({ username, userId: newUser.id }, "New user created");

    revalidatePath(USERS_MANAGEMENT_PATH);

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    logger.error(error, "Error creating user:");

    return {
      success: false,
      errors: {
        server: "An error occurred while creating the user. Please try again.",
      },
    };
  }
}

export async function deleteUserAction(userId: number) {
  try {
    logger.info({ userId }, "Deleting user:");

    await deleteUser(userId);

    logger.info({ userId }, "Deleted user:");

    revalidatePath(USERS_MANAGEMENT_PATH);

    return {
      success: false,
      message: `User ${userId} deleted successfully`,
    };
  } catch (error) {
    logger.error(error, "Error deleting user:");
    return {
      success: false,
      message: `Failed to delete user ${userId}`,
    };
  }
}

export async function updateUserAction(
  _state: UpdateUserFormState,
  formData: FormData
): Promise<UpdateUserFormState> {
  try {
    const userId = parseInt((formData.get("userId") as string) || "");

    if (!userId) {
      throw new Error("User ID is required");
    }

    const existingUser = await findUserById(userId);
    if (!existingUser) {
      return {
        success: false,
        errors: {
          username: ["User does not exist"],
        },
      };
    }

    // If current username != username provided, check if the new username already exists
    const currentUsername = existingUser.username;
    const username = formData.get("username") as string;
    const hasNewUsername = currentUsername !== username;
    if (hasNewUsername) {
      const userWithSameUsername = await findUserByUsername(username);
      if (userWithSameUsername) {
        return {
          success: false,
          errors: {
            username: ["Username already exists"],
          },
        };
      }
    }

    // If new password is provided, check whether old password is correct
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    let hasNewPassword = false;
    if (newPassword) {
      if (!currentPassword) {
        return {
          success: false,
          errors: {
            currentPassword: ["Current password is required"],
          },
        };
      }

      // Check whether old password is correct
      const hashedCurrentPassword = await hashPassword(currentPassword);
      if (existingUser.password !== hashedCurrentPassword) {
        return {
          success: false,
          errors: {
            currentPassword: ["Current password is incorrect"],
          },
        };
      }

      hasNewPassword = true;
    }

    // Validate form fields
    const validatedFields = updateUserFormSchema.safeParse({
      username: formData.get("username"),
      newPassword,
    });

    // If any form fields are invalid, return
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return {
        success: false,
        errors,
      };
    }

    if (!hasNewUsername && !hasNewPassword) {
      throw new Error("Either new username or new password is required");
    }

    logger.info({ userId }, "Updating user into database:");

    const hashedPassword = hasNewPassword
      ? await hashPassword(newPassword)
      : undefined;

    const updateUserInput: UpdateUserInput = {
      userId,
      newUsername: hasNewUsername ? username : undefined,
      newPassword: hasNewPassword ? hashedPassword : undefined,
    };

    const newUser = await updateUser(updateUserInput);

    logger.info({ userId }, "Updated user:");

    if (!newUser) {
      return {
        success: false,
        message: "Failed to update user",
      };
    }

    revalidatePath(USERS_MANAGEMENT_PATH);

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    logger.error(error, "Error updating user:");

    return {
      success: false,
      errors: {
        server: "An error occurred while updating the user. Please try again.",
      },
    };
  }
}
