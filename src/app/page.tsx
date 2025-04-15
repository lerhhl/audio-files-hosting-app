import { DEFAULT_HOME_PATH } from "@/app/constants";
import { redirectToLoginIfSessionNotFound } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Root() {
  await redirectToLoginIfSessionNotFound();

  redirect(DEFAULT_HOME_PATH);
}
