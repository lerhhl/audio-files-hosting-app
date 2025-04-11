"use server";

import { INVALID_USERNAME_OR_PASSWORD, LOGIN_PATH } from "@/app/constants";
import { findUserByUsername } from "@/lib/database";
import { createSession, verifySession } from "@/lib/session";
import { FormState } from "@/lib/types";
import { hashPassword } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function login(
  _state: FormState,
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
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
    const hashedPassword = await hashPassword(password as string);
    if (user.password !== hashedPassword) {
      console.log("Password mismatch for user:", username);
      return {
        success: false,
        message: INVALID_USERNAME_OR_PASSWORD,
      };
    }

    console.log("user", user);
    await createSession({
      username: user.username,
      isAdmin: user.isAdmin ?? false,
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message: INVALID_USERNAME_OR_PASSWORD,
    };
  }
}

export async function redirectToLoginIfSessionNotFound() {
  const { isAuth } = await verifySession();
  if (!isAuth) redirect(LOGIN_PATH);
}
