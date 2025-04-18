import LoadingSpinner from "@/components/LoadingSpinner";
import TopNavigationBarProps from "@/components/TopNavigationBar";
import UsersManagement from "@/components/UsersManagement";
import { redirectToLoginIfSessionNotFound } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DEFAULT_HOME_PATH } from "../constants";

export default async function UsersManagementPageWrapper() {
  const session = await redirectToLoginIfSessionNotFound();

  if (!session.isAdmin) {
    redirect(DEFAULT_HOME_PATH);
  }

  return (
    <>
      <TopNavigationBarProps session={session} />
      <Suspense fallback={<LoadingSpinner />}>
        <UsersManagement />;
      </Suspense>
    </>
  );
}
