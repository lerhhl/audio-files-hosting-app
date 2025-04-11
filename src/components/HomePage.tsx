"use client";

import { AUDIO_FILES_PATH, USERS_MANAGEMENT_PATH } from "@/app/constants";
import LogoutButton from "@/components/LogoutButton";
import { CommonComponentProps } from "@/components/types";
import Link from "next/link";

interface HomePageProps extends CommonComponentProps {
  readonly isAuth: boolean;
  readonly isAdmin: boolean;
}

export default function HomePage({ isAdmin, isAuth }: HomePageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-100">
      {isAuth && <LogoutButton />}
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Welcome to Audio File Hosting App
      </h1>

      <div className="flex space-x-4">
        {isAdmin && (
          <Link
            href={USERS_MANAGEMENT_PATH}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer text-center"
          >
            Users Management
          </Link>
        )}
        <Link
          href={AUDIO_FILES_PATH}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 cursor-pointer text-center"
        >
          Audio Files List
        </Link>
      </div>
    </div>
  );
}
