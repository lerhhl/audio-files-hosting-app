"use client";

import { APP_BASE_URL } from "@/app/config";
import CloseDialogButton from "@/components/CloseDialogButton";
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
        <div className="form-dialog-background">
          <div className="form-dialog-body">
            <CloseDialogButton closeDialog={closeDialog} />
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="string"
                  className="form-input-text"
                  required
                />
                {error?.username?.length &&
                  error.username.map((error) => (
                    <p key={error} className="form-input-error-text">
                      {error}
                    </p>
                  ))}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input-text"
                  required
                />
                {error?.password?.length &&
                  error.password.map((error) => (
                    <p key={error} className="form-input-error-text">
                      {error}
                    </p>
                  ))}
              </div>

              <div>
                <button type="submit" className="form-submit-button">
                  {isCreating ? "Creating User" : "Create User"}
                </button>
                {error?.server && (
                  <p className="form-input-error-text">{error?.server}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
