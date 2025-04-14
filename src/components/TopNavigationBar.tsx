"use client";

import { APP_BASE_URL } from "@/app/config";
import {
  AUDIO_FILES_PATH,
  LOGIN_PATH,
  USERS_MANAGEMENT_PATH,
} from "@/app/constants";
import { SessionType } from "@/lib/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

interface TopNavigationBarProps {
  readonly session: SessionType;
}

export default function TopNavigationBar({ session }: TopNavigationBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

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
    <div className="flex flex-col items-center justify-start bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <div className="flex space-x-4">
          {session.isAuth && (
            <Link
              href={AUDIO_FILES_PATH}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Audio Files Management
            </Link>
          )}
          {session.isAdmin && (
            <Link
              href={USERS_MANAGEMENT_PATH}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Users Management
            </Link>
          )}
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-gray-600 hover:text-gray-800 font-medium focus:outline-none"
          >
            {`Welcome ${session.username ?? "Guest"}`}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-20 bg-white border border-gray-200 rounded-md shadow-lg">
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
