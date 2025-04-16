import {
  deleteUser,
  findUserById,
  findUserByUsername,
  getAllAudioFilesByUserid,
  updateUser,
} from "@/lib/database";
import { updateUserFormSchema } from "@/lib/formDefinitions";
import { logger } from "@/lib/logger";
import { updateUsernameInSession, verifySession } from "@/lib/session";
import { UpdateUserInput } from "@/lib/types";
import { hashPassword } from "@/lib/utils";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

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

  // Only allow admin users to delete user
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden to delete user" },
      { status: 403 }
    );
  }

  try {
    const userId = req.nextUrl.pathname.split("/").pop();
    const parsedUpdatedUserId = parseInt(userId as string);

    if (!parsedUpdatedUserId) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    logger.info({ userId }, "Deleting user:");

    const existingUser = await findUserById(parsedUpdatedUserId);

    if (!existingUser) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // Get all audio files associated with the user
    const audioFiles = await getAllAudioFilesByUserid(parsedUpdatedUserId);
    if (audioFiles?.items.length > 0) {
      // Delete all audio files from the storage associated with the user
      audioFiles.items.forEach((audioFile) => {
        const filePath = path.join(process.cwd(), audioFile.filePath);

        // Check if the file exists before deleting
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await deleteUser(parsedUpdatedUserId);

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

/**
 * @swagger
 * tags:
 *   - Users
 * /api/users/{userId}:
 *   put:
 *     summary: Update a user by ID
 *     description: Update a user's username or password by their ID. Only admin users are allowed to perform this action.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username for the user.
 *                 example: johndoe
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the user (required if updating the password).
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: newsecurepassword123
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *       400:
 *         description: Invalid request or validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Username already exists"
 *                     currentPassword:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Current password is incorrect"
 *                     newPassword:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "New password must be between 3 and 20 characters long."
 *                     server:
 *                       type: string
 *                       example: "Failed to update user"
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
 *                   example: Forbidden to update user
 */
export async function PUT(req: NextRequest) {
  const { userId, isAuth, isAdmin } = await verifySession();

  if (!isAuth || !userId) {
    return NextResponse.json(
      { error: { server: "Session expired" } },
      { status: 401 }
    );
  }

  const updatedUserId = req.nextUrl.pathname.split("/").pop();
  const parsedUpdatedUserId = parseInt(updatedUserId as string);

  if (!parsedUpdatedUserId) {
    return NextResponse.json(
      { error: { server: "Invalid User ID" } },
      { status: 400 }
    );
  }

  // Allow only admin users or the user themselves to update the user's data
  if (parsedUpdatedUserId !== userId && !isAdmin) {
    return NextResponse.json(
      { error: { server: "Forbidden to update user" } },
      { status: 403 }
    );
  }

  try {
    const existingUser = await findUserById(parsedUpdatedUserId);

    if (!existingUser) {
      return NextResponse.json(
        { error: { server: "User does not exist" } },
        { status: 401 }
      );
    }

    // If current username != username provided, check if the new username already exists
    const currentUsername = existingUser.username;
    const body = await req.json();
    const { username } = body;
    const hasNewUsername = currentUsername !== username;

    if (hasNewUsername) {
      const userWithSameUsername = await findUserByUsername(username);
      if (userWithSameUsername) {
        return NextResponse.json(
          { error: { username: ["Username already exists"] } },
          { status: 400 }
        );
      }
    }

    // If new password is provided, check whether old password is correct
    const { currentPassword, newPassword } = body;
    let hasNewPassword = false;
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: { currentPassword: ["Current password is required"] } },
          { status: 400 }
        );
      }

      // Check whether old password is correct
      const hashedCurrentPassword = await hashPassword(currentPassword);
      if (existingUser.password !== hashedCurrentPassword) {
        return NextResponse.json(
          { error: { currentPassword: ["Current password is incorrect"] } },
          { status: 400 }
        );
      }

      hasNewPassword = true;
    }

    // Validate form fields
    const validatedFields = updateUserFormSchema.safeParse({
      username,
      newPassword,
    });

    // If any form fields are invalid, return
    if (!validatedFields.success) {
      const error = validatedFields.error.flatten().fieldErrors;
      return NextResponse.json({ error }, { status: 400 });
    }

    if (!hasNewUsername && !hasNewPassword) {
      return NextResponse.json(
        {
          error: { server: "Either new username or new password is required" },
        },
        { status: 400 }
      );
    }

    logger.info({ userId }, "Updating user into database:");

    const hashedPassword = hasNewPassword
      ? await hashPassword(newPassword)
      : undefined;

    const updateUserInput: UpdateUserInput = {
      userId: parsedUpdatedUserId,
      newUsername: hasNewUsername ? username : undefined,
      newPassword: hasNewPassword ? hashedPassword : undefined,
    };

    await updateUser(updateUserInput);

    logger.info({ userId }, "Updated user into database:");

    // If the user is updating their own username, update the session
    if (hasNewUsername && parsedUpdatedUserId === userId) {
      await updateUsernameInSession(username);
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error(error, "Error updating user:");

    return NextResponse.json(
      {
        error: { server: "An error occurred while updating the user" },
      },
      { status: 400 }
    );
  }
}
