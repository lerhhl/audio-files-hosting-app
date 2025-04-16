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
  const { iat, exp, expiresAt } = generateSessionTimestamps();
  const jwtToken = await encrypt(encodedKey, exp, {
    userId,
    username,
    isAdmin,
    iat,
    exp,
  });

  await setCookie(jwtToken, expiresAt);
}

export async function updateUsernameInSession(newUsername: string) {
  const cookie = (await cookies()).get("session")?.value;
  const { isAdmin, isAuth, userId } = await decrypt(encodedKey, cookie);

  if (!isAuth || !userId || !newUsername) {
    return;
  }

  const { iat, exp, expiresAt } = generateSessionTimestamps();
  const jwtToken = await encrypt(encodedKey, exp, {
    userId,
    username: newUsername,
    isAdmin,
    iat,
    exp,
  });

  await setCookie(jwtToken, expiresAt);
}

export async function verifySession(): Promise<SessionType> {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(encodedKey, cookie);
  const invalidSession = {
    userId: undefined,
    username: undefined,
    isAuth: false,
    isAdmin: false,
    iat: undefined,
    exp: undefined,
  };

  if (!session?.isAuth) {
    return invalidSession;
  }

  if (isSessionExpired(session.exp)) {
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return invalidSession;
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

/**
 * Generates the issued at (iat) and expiration (exp) timestamps.
 * The iat is set to the current time, and the exp is set to the current time plus the session expiration time.
 * The expiration time is calculated based on the SESSION_EXPIRATION_TIME constant.
 * @returns An object containing the iat (issued at), exp (expiration), and expiresAt (Date object) timestamps.
 */
function generateSessionTimestamps(): {
  iat: number;
  exp: number;
  expiresAt: Date;
} {
  const currentTime = Date.now();
  const expiresAt = new Date(
    currentTime + SESSION_EXPIRATION_TIME.milliseconds
  );
  const iat = Math.floor(currentTime / 1000);
  const exp = Math.floor(expiresAt.getTime() / 1000);

  return { iat, exp, expiresAt };
}

function isSessionExpired(exp?: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  return !exp || exp < currentTime;
}
