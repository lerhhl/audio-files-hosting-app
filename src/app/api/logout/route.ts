import { LogoutResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * tags:
 *   - Authentication
 * /api/logout:
 *   post:
 *     summary: User logout
 *     description: Delete a user session
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<LogoutResponse>> {
  const { value } = req.cookies.get("session") ?? {};
  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );

  if (value) {
    response.cookies.set("session", "", { maxAge: 0 });
  }

  return response;
}
