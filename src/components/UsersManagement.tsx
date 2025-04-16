"use client";

import { APP_BASE_URL } from "@/app/config";
import ConfirmUserDeleteDialog from "@/components/ConfirmUserDeleteDialog";
import CreateUserForm from "@/components/CreateUserForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { User } from "@/components/types";
import { calculateTotalPages, generateHeaders } from "@/components/utils";
import { useCallback, useEffect, useState } from "react";
import UpdateUserDialog from "./UpdateUserDialog";

export default function UsersManagement() {
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
        setError(data.error ?? "Failed to fetch users.");
        setIsLoading(false);
        setUsers([]);
        setTotalPages(1);
        return;
      }

      setUsers(data.items ?? []);
      setTotalPages(calculateTotalPages(data.totalCount, itemsPerPage));
      setIsLoading(false);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setUsers([]);
      setTotalPages(1);
      setIsLoading(false);
      setError("Failed to fetch users. Please try again later.");
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, fetchUsers]);

  return (
    <div className="list-page">
      <h1 className="list-page-header">Users Management</h1>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <div className="w-full max-w-4xl">
          <div className="flex justify-end mb-1">
            <CreateUserForm onSuccess={fetchUsers} />
          </div>
          <table className="table">
            <thead>
              <tr className="table-header-row-cell">
                <th className="table-row-cell-text">Username</th>
                <th className="table-row-cell-text">Is Admin</th>
                <th className="table-row-cell-text">Created At</th>
                <th className="table-row-cell-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                // If empty, display a message
                <tr>
                  <td colSpan={5} className="table-row-cell-text text-center">
                    {error ?? "No audio files found."}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="table-row-cell-text">{user.username}</td>
                    <td className="table-row-cell-text">
                      {user.isAdmin ? "Yes" : "No"}
                    </td>
                    <td className="table-row-cell-text">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-row-cell-text ">
                      <div className="flex justify-center space-x-8">
                        <UpdateUserDialog
                          user={{
                            id: user.id,
                            username: user.username,
                          }}
                          iconButton={true}
                          onSuccess={fetchUsers}
                        />
                        <ConfirmUserDeleteDialog
                          userId={user.id}
                          username={user.username}
                          isAdmin={user.isAdmin}
                          onSuccess={fetchUsers}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        </div>
      )}
    </div>
  );
}
