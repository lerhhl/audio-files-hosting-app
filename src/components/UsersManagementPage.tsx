"use client";

import { APP_BASE_URL } from "@/app/config";
import ConfirmUserDeleteDialog from "@/components/ConfirmUserDeleteDialog";
import CreateUserForm from "@/components/CreateUserForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { User } from "@/components/types";
import { calculateTotalPages, generateHeaders } from "@/components/utils";
import { useCallback, useEffect, useState } from "react";
import UpdateUserDialog from "./UpdateUserDialog";

export default function UsersManagementPage() {
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const url = `${APP_BASE_URL}/api/users`;

    try {
      const headers = generateHeaders();
      const response = await fetch(
        `${url}?page=${currentPage}&pageSize=${itemsPerPage}`,
        {
          method: "GET",
          headers,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error();
      }

      setUsers(data.items ?? []);
      setTotalPages(calculateTotalPages(data.totalCount, itemsPerPage));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setUsers([]);
      setTotalPages(1);
      setError("Failed to fetch users. Please try again later.");
      return;
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, fetchUsers]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 bg-gray-100">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Users Management Page
      </h1>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
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
              {users.length === 0 ? (
                // If empty, display a message
                <tr>
                  <td
                    colSpan={5}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {error ?? "No audio files found."}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.username} className="text-center">
                    <td className="border border-gray-300 px-1 py-2">
                      {user.username}
                    </td>
                    <td className="border border-gray-300 px-1 py-2">
                      {user.isAdmin ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 px-1 py-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-1 py-2 ">
                      <div className="flex justify-center space-x-8">
                        <UpdateUserDialog
                          user={{
                            id: user.id,
                            username: user.username,
                          }}
                          iconButton={true}
                        />
                        <ConfirmUserDeleteDialog
                          userId={user.id}
                          username={user.username}
                          isAdmin={user.isAdmin}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
