"use server";

import {
  INVALID_USERNAME_OR_PASSWORD_ERROR,
  LOGIN_PATH,
} from "@/app/constants";
import { findUserByUsername } from "@/lib/database";
import { logger } from "@/lib/logger";
import { createSession, verifySession } from "@/lib/session";
import { LoginFormState, SessionType } from "@/lib/types";
import { hashPassword } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function login(
  _state: LoginFormState,
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    const username = formData.get("username") || "";
    const password = formData.get("password") || "";

    if (!username || !password) {
      logger.info("Username or password is empty");
      return {
        success: false,
        message: INVALID_USERNAME_OR_PASSWORD_ERROR,
      };
    }

    // Check if the user exists in the database
    const user = await findUserByUsername(username as string);
    if (!user) {
      logger.info({ username }, "User not found by:");
      return {
        success: false,
        message: INVALID_USERNAME_OR_PASSWORD_ERROR,
      };
    }

    // Verify the password
    const hashedPassword = await hashPassword(password as string);
    if (user.password !== hashedPassword) {
      logger.info({ username }, "Password mismatch for user:");
      return {
        success: false,
        message: INVALID_USERNAME_OR_PASSWORD_ERROR,
      };
    }

    await createSession({
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin ?? false,
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    logger.error(error, "Error during login:");
    return {
      success: false,
      message: INVALID_USERNAME_OR_PASSWORD_ERROR,
    };
  }
}

export async function redirectToLoginIfSessionNotFound(): Promise<SessionType> {
  const session = await verifySession();
  if (!session.isAuth) redirect(LOGIN_PATH);

  return session;
}
