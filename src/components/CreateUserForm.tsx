"use client";

import { APP_BASE_URL } from "@/app/config";
import { CreateUserFormErrors } from "@/components/types";
import { useState } from "react";

type CreateUserFormProps = {
  readonly onSuccess: () => void;
};

export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<CreateUserFormErrors | undefined>(
    undefined
  );
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setError(undefined);
    setIsOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    setError(undefined);

    try {
      const form = e.currentTarget;
      const url = `${APP_BASE_URL}/api/users`;
      const formData = {
        username: form.username.value,
        password: form.password.value,
      };

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsCreating(false);
        closeDialog();
        onSuccess();
      } else {
        const body = await response.json();
        setIsCreating(false);
        setError(body?.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsCreating(false);
      setError({
        server: "Failed to create user. Please try again later.",
      });
    }
  };

  return (
    <>
      <button
        onClick={openDialog}
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        Add User
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="relative bg-white opacity-100 rounded-lg p-6 w-full max-w-md z-10">
            <button
              onClick={closeDialog}
              className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="string"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {error?.username?.length &&
                  error.username.map((error) => (
                    <p key={error} className="text-red-500 text-sm mt-1">
                      {error}
                    </p>
                  ))}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {error?.password?.length &&
                  error.password.map((error) => (
                    <p key={error} className="text-red-500 text-sm mt-1">
                      {error}
                    </p>
                  ))}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 disabled:opacity-50"
              >
                {isCreating ? "Creating User" : "Create User"}
              </button>
              {error?.server && (
                <p className="text-red-500 text-sm">{error?.server}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
