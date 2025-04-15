import { LOGIN_PATH } from "@/app/constants";
import { verifySession } from "@/lib/session";
import { SessionType } from "@/lib/types";
import { redirect } from "next/navigation";

/**
 *
 * @returns A promise resolving to a SessionType object indicating the user's authentication status.
 *
 * Redirects to the login page if the session is not found.
 */
export async function redirectToLoginIfSessionNotFound(): Promise<SessionType> {
  const session = await verifySession();
  if (!session.isAuth) redirect(LOGIN_PATH);

  return session;
}
