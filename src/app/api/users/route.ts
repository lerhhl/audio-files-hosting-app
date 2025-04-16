import { createUser, findUserByUsername, getAllUsers } from "@/lib/database";
import { createUserFormSchema } from "@/lib/formDefinitions";
import { logger } from "@/lib/logger";
import { verifySession } from "@/lib/session";
import { CreateUserResponse, GetUsersResponse } from "@/lib/types";
import { hashPassword } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * tags:
 *   - Users
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     description: Get a list of users
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number to retrieve
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: The number of users to retrieve per page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Returns a list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-10-01T12:00:00Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-10-01T12:00:00Z
 *                     required:
 *                       - id
 *                       - name
 *                       - createdAt
 *                       - updatedAt
 *                 totalCount:
 *                   type: integer
 *                   example: 100
 *               required:
 *                 - items
 *                 - totalCount
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to get users
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
 *                   example: "Forbidden to get users"
 */
export async function GET(
  req: NextRequest
): Promise<NextResponse<GetUsersResponse>> {
  const { userId, isAuth, isAdmin } = await verifySession();

  if (!isAuth || !userId) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  // Only allow admin users to get users
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden to get users" },
      { status: 403 }
    );
  }

  try {
    const query = req.nextUrl.searchParams;
    const page = parseInt(query.get("page") ?? "1");
    const pageSize = parseInt(query.get("pageSize") ?? "10");
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const { items, totalCount } = await getAllUsers(offset, limit);

    return NextResponse.json({ items, totalCount }, { status: 200 });
  } catch (error) {
    logger.error(error, "Error getting users");

    return NextResponse.json({ error: "Failed to get users" }, { status: 400 });
  }
}

/**
 * @swagger
 * tags:
 *   - Users
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with a unique username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *                 example: securepassword123
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-10-01T12:00:00Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-10-01T12:00:00Z
 *                   required:
 *                     - id
 *                     - username
 *                     - createdAt
 *                     - updatedAt
 *               required:
 *                 - message
 *                 - user
 *       400:
 *         description: Failed to create user.
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
 *                     password:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Password must be at least 3 characters long"
 *                     server:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Failed to create user"
 *
 *       401:
 *         description: Unauthorized (e.g., session expired).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                       example: "Session expired"
 *       403:
 *         description: Forbidden (e.g., user is not an admin).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                       example: "Forbidden to create new user"
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<CreateUserResponse>> {
  const { userId, isAuth, isAdmin } = await verifySession();

  if (!isAuth || !userId) {
    return NextResponse.json(
      { error: { server: "Session expired" } },
      { status: 401 }
    );
  }

  // Only allow admin users to create new users
  if (!isAdmin) {
    return NextResponse.json(
      { error: { server: "Forbidden to create new user" } },
      { status: 403 }
    );
  }

  try {
    logger.info("creating user...");

    const body = await req.json();
    const { username, password } = body;

    const validatedFields = createUserFormSchema.safeParse({
      username,
      password,
    });

    // If any form fields are invalid, return
    if (!validatedFields.success) {
      const error = validatedFields.error.flatten().fieldErrors;
      return NextResponse.json({ error }, { status: 400 });
    }

    const { username: validatedUsername, password: validatedPassword } =
      validatedFields.data;

    // Check if the user already exists
    const existingUser = await findUserByUsername(validatedUsername);

    if (existingUser) {
      return NextResponse.json(
        { error: { username: ["Username already exists"] } },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validatedPassword);

    logger.info({ validatedUsername }, "Inserting user into database:");

    const newUser = await createUser({
      username: validatedUsername,
      hashedPassword,
    });

    if (!newUser) {
      return NextResponse.json(
        { error: { server: "Failed to create user" } },
        { status: 400 }
      );
    }

    logger.info(
      { username: newUser.username, userId: newUser.id },
      "New user created"
    );

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error(error, "Error creating user:");

    return NextResponse.json(
      { error: { server: "Failed to create user" } },
      { status: 400 }
    );
  }
}
