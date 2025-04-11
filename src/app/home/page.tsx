import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import HomePage from "@/components/HomePage";
import LogoutButton from "@/components/LogoutButton";
import { verifySession } from "@/lib/session";

export default async function HomePageWrapper() {
  await redirectToLoginIfSessionNotFound();
  const { isAuth } = await verifySession();

  return (
    <>
      {isAuth && <LogoutButton />}
      <HomePage />
    </>
  );
}
