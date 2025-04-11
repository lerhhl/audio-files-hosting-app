import { SessionPayload, SessionType } from "@/lib/types";
import { SignJWT, jwtVerify } from "jose";

export async function encodePassword(password: string) {
  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedPassword);
  const hashedPassword = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashedPassword;
}

export async function encrypt(
  encodedKey: Uint8Array<ArrayBufferLike>,
  expirationTimeInDays: number,
  payload: SessionPayload
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expirationTimeInDays}d`)
    .sign(encodedKey);
}

export async function decrypt(
  encodedKey: Uint8Array<ArrayBufferLike>,
  session: string = ""
): Promise<SessionType> {
  const invalidSession = {
    userId: undefined,
    isAuth: false,
  };

  if (!session) {
    return invalidSession;
  }

  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ["HS256"],
    });

    if (!payload?.userId) {
      return invalidSession;
    }

    return {
      userId: payload.userId,
      isAuth: true,
    };
  } catch (error) {
    console.error("Session decryption failed:", error);
    return invalidSession;
  }
}
