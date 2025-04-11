import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import UsersManagementPage from "@/components/UsersManagementPage";
import { verifySession } from "@/lib/session";

export default async function UsersManagementPageWrapper() {
  await redirectToLoginIfSessionNotFound();
  const { isAuth } = await verifySession();

  return <UsersManagementPage isAuth={isAuth} />;
}
