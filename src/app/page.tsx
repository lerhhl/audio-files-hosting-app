import { LOGIN_PATH } from "@/app/constants";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect(LOGIN_PATH);
}
