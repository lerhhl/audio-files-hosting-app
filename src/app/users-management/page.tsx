import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import { getAllUsersAction } from "@/actions/user";
import LoadingSpinner from "@/components/LoadingSpinner";
import UsersManagementPage from "@/components/UsersManagementPage";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DEFAULT_HOME_PATH } from "../constants";

export default async function UsersManagementPageWrapper() {
  await redirectToLoginIfSessionNotFound();
  const { isAuth, isAdmin } = await verifySession();
  const users = getAllUsersAction();

  if (!isAdmin) {
    redirect(DEFAULT_HOME_PATH);
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UsersManagementPage isAuth={isAuth} users={users} />;
    </Suspense>
  );
}
