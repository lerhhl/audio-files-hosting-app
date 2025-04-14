import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import { getAllUsersAction } from "@/actions/user";
import LoadingSpinner from "@/components/LoadingSpinner";
import TopNavigationBarProps from "@/components/TopNavigationBar";
import UsersManagementPage from "@/components/UsersManagementPage";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DEFAULT_HOME_PATH } from "../constants";

export default async function UsersManagementPageWrapper() {
  const session = await redirectToLoginIfSessionNotFound();
  const users = getAllUsersAction();

  if (!session.isAdmin) {
    redirect(DEFAULT_HOME_PATH);
  }

  return (
    <>
      <TopNavigationBarProps session={session} />
      <Suspense fallback={<LoadingSpinner />}>
        <UsersManagementPage users={users} />;
      </Suspense>
    </>
  );
}
