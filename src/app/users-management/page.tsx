import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import UsersManagementPage from "@/components/UsersManagementPage";

export default async function UsersManagementPageWrapper() {
  await redirectToLoginIfSessionNotFound();

  return <UsersManagementPage />;
}
