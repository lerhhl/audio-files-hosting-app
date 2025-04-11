"use client";

import ConfirmUserDeleteDialog from "@/components/ConfirmUserDeleteDialog";
import CreateUserForm from "@/components/CreateUserForm";
import LogoutButton from "@/components/LogoutButton";
import { CommonComponentProps, User } from "@/components/types";
import { use } from "react";

interface UsersManagementProps extends Omit<CommonComponentProps, "isAdmin"> {
  readonly isAuth: boolean;
  readonly users: Promise<User[]>;
}

export default function UsersManagementPage({
  isAuth,
  users,
}: UsersManagementProps) {
  const usersList = use(users);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 bg-gray-100">
      {isAuth && <LogoutButton />}
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Welcome to Users Management Page
      </h1>
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-1">
          <CreateUserForm />
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-1 py-2">Username</th>
              <th className="border border-gray-300 px-1 py-2">Is Admin</th>
              <th className="border border-gray-300 px-1 py-2">Created At</th>
              <th className="border border-gray-300 px-1 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user, index) => (
              <tr key={user.username} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {user.username}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.isAdmin ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.createdAt.toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 ">
                  <ConfirmUserDeleteDialog
                    username={user.username}
                    isAdmin={user.isAdmin}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
