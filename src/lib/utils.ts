"use server";

import { logger } from "@/lib/logger";
import { SessionPayload, SessionType } from "@/lib/types";
import { SignJWT, jwtVerify } from "jose";
import crypto from "node:crypto";

/**
 *  Hashes the password using SHA-256 algorithm.
 *  This is a one-way hashing function and is not reversible.
 *  It is used to securely store passwords.
 *  @param password - The password to be hashed.
 *  @returns The hashed password as a string.
 *  @throws Error if the hashing process fails.
 */
export async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedPassword);
  const hashedPassword = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashedPassword;
}

/**
 * Encrypts the payload using the provided key and expiration time.
 * @param encodedKey - The key used for encryption.
 * @param expiration - The expiration time in seconds for the token.
 * @param payload - The payload to be encrypted.
 * @returns A promise resolving to the encrypted token as a string.
 */
export async function encrypt(
  encodedKey: Uint8Array<ArrayBufferLike>,
  expiration: number,
  payload: SessionPayload
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(encodedKey);
}

/**
 * Decrypts the session using the provided key and session string.
 * Returns a SessionType object indicating the user's authentication status.
 * @param encodedKey - The key used for decryption.
 * @param session - The session string to decrypt.
 * @returns A promise resolving to a SessionType object.
 */
export async function decrypt(
  encodedKey: Uint8Array<ArrayBufferLike>,
  session: string = ""
): Promise<SessionType> {
  const invalidSession = {
    userId: undefined,
    username: undefined,
    isAuth: false,
    isAdmin: false,
    iat: undefined,
    exp: undefined,
  };

  if (!session) {
    return invalidSession;
  }

  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ["HS256"],
    });

    if (!payload?.username) {
      return invalidSession;
    }

    return {
      ...payload,
      isAuth: true,
    };
  } catch (error) {
    logger.error(error, "Session decryption failed:");

    return invalidSession;
  }
}
