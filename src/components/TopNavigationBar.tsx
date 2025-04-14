"use client";

import { APP_BASE_URL } from "@/app/config";
import {
  AUDIO_FILES_PATH,
  LOGIN_PATH,
  USERS_MANAGEMENT_PATH,
} from "@/app/constants";
import { useOutsideClickHandler } from "@/app/hooks/useOutsideClickHandler";
import { SessionType } from "@/lib/types";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import UpdateUserDialog from "./UpdateUserDialog";

interface TopNavigationBarProps {
  readonly session: SessionType;
}

export default function TopNavigationBar({ session }: TopNavigationBarProps) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ id?: number; username?: string }>({
    id: undefined,
    username: undefined,
  });

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

  useEffect(() => {
    setUser({
      id: session.userId,
      username: session.username,
    });
  }, [session]);

  useOutsideClickHandler(dialogRef, setIsDropdownOpen, isDropdownOpen);

  return (
    <div className="flex flex-col items-center justify-start bg-gray-100">
      <nav className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <div className="flex space-x-4">
          {session.isAuth && (
            <Link
              href={AUDIO_FILES_PATH}
              className={`font-bold ${
                pathname === AUDIO_FILES_PATH
                  ? "text-blue-500 hover:text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Audio Files Management
            </Link>
          )}
          {session.isAdmin && (
            <>
              <p>|</p>
              <Link
                href={USERS_MANAGEMENT_PATH}
                className={`font-bold ${
                  pathname === USERS_MANAGEMENT_PATH
                    ? "text-blue-500 hover:text-blue-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Users Management
              </Link>
            </>
          )}
        </div>
        <div className="relative" ref={dialogRef}>
          <button
            onClick={toggleDropdown}
            className="text-gray-600 hover:text-gray-900 font-medium focus:outline-none cursor-pointer"
          >
            {`Welcome ${session.username ?? "Guest"}`}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-35 bg-white border border-gray-200 rounded-md shadow-lg">
              <UpdateUserDialog
                user={user}
                iconButton={false}
                onSuccess={() => {}}
              />
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
