"use server";

import { INVALID_USERNAME_OR_PASSWORD } from "@/app/constants";
import { findUserByUsername } from "@/lib/database";
import { FormState } from "@/lib/types";
import { encodePassword } from "@/lib/utils";

export async function login(
  _state: FormState,
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  const username = formData.get("username") || "";
  const password = formData.get("password") || "";

  if (!username || !password) {
    console.log("Username or password is empty");
    return {
      success: false,
      message: INVALID_USERNAME_OR_PASSWORD,
    };
  }

  // Check if the user exists in the database
  const user = await findUserByUsername(username as string);
  if (!user) {
    console.log("User not found by:", username);
    return {
      success: false,
      message: INVALID_USERNAME_OR_PASSWORD,
    };
  }

  // Verify the password
  const hashedPassword = await encodePassword(password as string);
  if (user.password !== hashedPassword) {
    console.log("Password mismatch for user:", username);
    return {
      success: false,
      message: INVALID_USERNAME_OR_PASSWORD,
    };
  }

  return {
    success: true,
    message: "Login successful",
  };
}
