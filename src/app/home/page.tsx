import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import HomePage from "@/components/HomePage";
import { verifySession } from "@/lib/session";

export default async function HomePageWrapper() {
  await redirectToLoginIfSessionNotFound();
  const { isAuth, isAdmin } = await verifySession();

  return <HomePage isAdmin={isAdmin} isAuth={isAuth} />;
}
