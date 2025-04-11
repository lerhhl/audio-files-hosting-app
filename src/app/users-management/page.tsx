import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import { getAllUsersAction } from "@/actions/user";
import LoadingSpinner from "@/components/LoadingSpinner";
import UsersManagementPage from "@/components/UsersManagementPage";
import { verifySession } from "@/lib/session";
import { Suspense } from "react";

export default async function UsersManagementPageWrapper() {
  await redirectToLoginIfSessionNotFound();
  const { isAuth } = await verifySession();
  const users = getAllUsersAction();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UsersManagementPage isAuth={isAuth} users={users} />;
    </Suspense>
  );
}
