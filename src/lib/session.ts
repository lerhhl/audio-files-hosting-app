import { SECRET_KEY } from "@/app/config";
import { SESSION_EXPIRATION_TIME } from "@/app/constants";
import { SessionType } from "@/lib/types";
import { decrypt, encrypt } from "@/lib/utils";
import { cookies } from "next/headers";
import "server-only";

export const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function createSession(userId: string, username: string) {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_TIME.milliseconds);
  const jwtToken = await encrypt(encodedKey, SESSION_EXPIRATION_TIME.days, {
    userId,
    username,
    iat: Math.floor(Date.now() / 1000),
    exp: expiresAt.getTime() / 1000,
  });
  const cookieStore = await cookies();

  cookieStore.set("session", jwtToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession(): Promise<SessionType> {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(encodedKey, cookie);

  if (!session?.userId) {
    return { isAuth: false, userId: undefined };
  }

  return { isAuth: true, userId: session.userId };
}
