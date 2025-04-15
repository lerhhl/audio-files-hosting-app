import { SECRET_KEY } from "@/app/config";
import { SESSION_EXPIRATION_TIME } from "@/app/constants";
import { CreateSessionPayload, SessionType } from "@/lib/types";
import { decrypt, encrypt } from "@/lib/utils";
import { cookies } from "next/headers";
import "server-only";

export const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function createSession({
  userId,
  username,
  isAdmin = false,
}: CreateSessionPayload) {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_TIME.milliseconds);
  const jwtToken = await encrypt(encodedKey, SESSION_EXPIRATION_TIME.days, {
    userId,
    username,
    isAdmin,
    iat: Math.floor(Date.now() / 1000),
    exp: expiresAt.getTime() / 1000,
  });

  await setCookie(jwtToken, expiresAt);
}

export async function updateUsernameInSession(newUsername: string) {
  const cookie = (await cookies()).get("session")?.value;
  const { isAdmin, isAuth, userId } = await decrypt(encodedKey, cookie);

  if (!isAuth || !userId || !newUsername) {
    return;
  }

  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_TIME.milliseconds);
  const jwtToken = await encrypt(encodedKey, SESSION_EXPIRATION_TIME.days, {
    userId,
    username: newUsername,
    isAdmin,
    iat: Math.floor(Date.now() / 1000),
    exp: expiresAt.getTime() / 1000,
  });

  await setCookie(jwtToken, expiresAt);
}

export async function verifySession(): Promise<SessionType> {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(encodedKey, cookie);

  if (!session?.isAuth) {
    return {
      userId: undefined,
      username: undefined,
      isAuth: false,
      isAdmin: false,
    };
  }

  return session;
}

async function setCookie(jwtToken: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set("session", jwtToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "strict",
    path: "/",
  });
}
