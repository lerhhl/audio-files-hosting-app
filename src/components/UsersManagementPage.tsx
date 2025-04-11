"use client";

import LogoutButton from "@/components/LogoutButton";
import { CommonComponentProps } from "@/components/types";

interface UsersManagementProps extends Omit<CommonComponentProps, "isAdmin"> {
  readonly isAuth: boolean;
}

export default function UsersManagementPage({ isAuth }: UsersManagementProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-100">
      {isAuth && <LogoutButton />}
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Welcome to Users Management Page
      </h1>
    </div>
  );
}
