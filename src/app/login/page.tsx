import { DEFAULT_HOME_PATH } from "@/app/constants";
import LoginPage from "@/components/LoginPage";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginWrapper() {
  const { isAuth } = await verifySession();

  if (isAuth) {
    redirect(DEFAULT_HOME_PATH);
  }

  return <LoginPage />;
}
