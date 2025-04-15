import { deleteUser, findUserById } from "@/lib/database";
import { logger } from "@/lib/logger";
import { verifySession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * tags:
 *   - Users
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user by their ID. Only admin users are allowed to perform this action.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User 123 deleted successfully
 *       400:
 *         description: Invalid request or user does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User does not exist
 *       401:
 *         description: Unauthorized (e.g., session expired).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Session expired
 *       403:
 *         description: Forbidden (e.g., user is not an admin).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden to delete user
 */
export async function DELETE(req: NextRequest) {
  const { userId, isAuth, isAdmin } = await verifySession();

  if (!isAuth || !userId) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  // Only allow admin users to create new users
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden to create new user" },
      { status: 403 }
    );
  }

  try {
    const userId = req.nextUrl.pathname.split("/").pop();
    const parsedUserId = parseInt(userId as string);

    if (!parsedUserId) {
      return { error: "Invalid File ID", status: 400 };
    }

    logger.info({ userId }, "Deleting user:");

    const existingUser = await findUserById(parsedUserId);

    if (!existingUser) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    await deleteUser(parsedUserId);

    logger.info({ userId }, "Deleted user:");

    return NextResponse.json(
      { message: `User ${userId} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    logger.error(error, "Error deleting user:");

    return NextResponse.json(
      { error: `Failed to delete user ${userId}` },
      { status: 400 }
    );
  }
}
