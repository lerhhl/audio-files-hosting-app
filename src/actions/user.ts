"use server";

import { USERS_MANAGEMENT_PATH } from "@/app/constants";
import { UpdateUserFormState } from "@/components/types";
import {
  deleteUser,
  findUserById,
  findUserByUsername,
  updateUser,
} from "@/lib/database";
import { updateUserFormSchema } from "@/lib/formDefinitions";
import { logger } from "@/lib/logger";
import { UpdateUserInput } from "@/lib/types";
import { hashPassword } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function deleteUserAction(userId: number) {
  try {
    logger.info({ userId }, "Deleting user:");

    await deleteUser(userId);

    logger.info({ userId }, "Deleted user:");

    revalidatePath(USERS_MANAGEMENT_PATH);

    return {
      success: true,
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
        error: {
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
          error: {
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
          error: {
            currentPassword: ["Current password is required"],
          },
        };
      }

      // Check whether old password is correct
      const hashedCurrentPassword = await hashPassword(currentPassword);
      if (existingUser.password !== hashedCurrentPassword) {
        return {
          success: false,
          error: {
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
        error: errors,
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
      error: {
        server: "An error occurred while updating the user. Please try again.",
      },
    };
  }
}
