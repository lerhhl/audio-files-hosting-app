import { SECRET_KEY } from "@/app/config";
import { SESSION_EXPIRATION_TIME } from "@/app/constants";
import { CreateSessionPayload, SessionType } from "@/lib/types";
import { decrypt, encrypt } from "@/lib/utils";
import { cookies } from "next/headers";
import "server-only";

export const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function createSession({
  username,
  isAdmin = false,
}: CreateSessionPayload) {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_TIME.milliseconds);
  const jwtToken = await encrypt(encodedKey, SESSION_EXPIRATION_TIME.days, {
    username,
    isAdmin,
    iat: Math.floor(Date.now() / 1000),
    exp: expiresAt.getTime() / 1000,
  });
  const cookieStore = await cookies();

  cookieStore.set("session", jwtToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "strict",
    path: "/",
  });
}

export async function verifySession(): Promise<SessionType> {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(encodedKey, cookie);

  if (!session?.username) {
    return { isAuth: false, username: undefined, isAdmin: false };
  }

  return { isAuth: true, username: session.username, isAdmin: session.isAdmin };
}
