import { INVALID_USERNAME_OR_PASSWORD_ERROR } from "@/app/constants";
import { findUserByUsername } from "@/lib/database";
import { logger } from "@/lib/logger";
import { createSession } from "@/lib/session";
import { LoginInput, LoginResponse } from "@/lib/types";
import { hashPassword } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * tags:
 *   - Authentication
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Create a new session for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: testpassword
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid username or password
 *               required:
 *                 - message
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<LoginResponse>> {
  const body: LoginInput = await req.json();
  const { username, password } = body;

  if (!username || !password) {
    logger.info("Username or password is empty");
    return NextResponse.json(
      {
        message: INVALID_USERNAME_OR_PASSWORD_ERROR,
      },
      { status: 401 }
    );
  }

  // Check if the user exists in the database
  const user = await findUserByUsername(username as string);
  if (!user) {
    logger.info({ username }, "User not found by:");
    return NextResponse.json(
      {
        message: INVALID_USERNAME_OR_PASSWORD_ERROR,
      },
      { status: 401 }
    );
  }

  // Verify the password
  const hashedPassword = await hashPassword(password);
  if (user.password !== hashedPassword) {
    logger.info({ username }, "Password mismatch for user:");
    return NextResponse.json(
      {
        message: INVALID_USERNAME_OR_PASSWORD_ERROR,
      },
      { status: 401 }
    );
  }

  await createSession({
    userId: user.id,
    username: user.username,
    isAdmin: user.isAdmin ?? false,
  });

  return NextResponse.json({ message: "Login successful" }, { status: 201 });
}
