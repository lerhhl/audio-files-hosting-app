import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import { DEFAULT_HOME_PATH } from "@/app/constants";
import { redirect } from "next/navigation";

export default async function Root() {
  await redirectToLoginIfSessionNotFound();

  redirect(DEFAULT_HOME_PATH);
}
