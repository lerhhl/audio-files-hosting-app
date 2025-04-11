"use client";

import { APP_BASE_URL } from "@/app/config";
import { LOGIN_PATH } from "@/app/constants";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  const handleLogout = async () => {
    const url = `${APP_BASE_URL}/api/logout`;
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${sessionCookie}`,
      },
    });

    redirect(LOGIN_PATH);
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-1 px-2 rounded fixed top-2 right-2 z-50"
      type="button"
    >
      Logout
    </button>
  );
}
