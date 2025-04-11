import { NextRequest, NextResponse } from "next/server";

/**
 * Logout the user by clearing the session cookie.
 * @param req NextRequest
 * @returns
 */
export async function POST(req: NextRequest) {
  const { value } = req.cookies.get("session") ?? {};
  const response = NextResponse.json({ success: true });

  if (value) {
    response.cookies.set("session", "", { maxAge: 0 });
  }

  return response;
}
