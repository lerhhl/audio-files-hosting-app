"use client";

import { createUserAction } from "@/actions/user";
import { CreateUserFormState } from "@/components/types";
import { useActionState, useCallback, useEffect, useState } from "react";

type CreateUserFormProps = {
  readonly onSuccess: () => void;
};

export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [state, action, pending] = useActionState<CreateUserFormState>(
    // @ts-expect-error ignore type error
    createUserAction,
    { errors: undefined }
  );
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = useCallback(() => {
    state.errors = undefined;
    setIsOpen(false);
  }, [state]);

  useEffect(() => {
    if (state?.success) {
      closeDialog();
      onSuccess();
    }
  }, [state, closeDialog, onSuccess]);

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
            <form className="flex flex-col gap-4" action={action}>
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
                {state?.errors?.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.username}
                  </p>
                )}
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
                {state?.errors?.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 disabled:opacity-50"
              >
                {pending ? "Creating User" : "Create User"}
              </button>
              {state?.errors?.server && (
                <p className="text-red-500 text-sm">{state?.errors?.server}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
