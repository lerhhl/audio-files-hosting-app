import { APP_BASE_URL } from "@/app/config";
import CloseDialogButton from "@/components/CloseDialogButton";
import { UpdateUserFormErrors } from "@/components/types";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export type UpdateUserDialogProps = {
  readonly iconButton?: boolean;
  readonly user: {
    readonly id?: number;
    readonly username?: string;
  };
  readonly onSuccess: (newUsername: string) => void;
};

export default function UpdateUserDialog({
  user,
  iconButton = true,
  onSuccess,
}: UpdateUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<UpdateUserFormErrors | undefined>(
    undefined
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setError(undefined);
    setIsUpdating(false);
    setIsOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(undefined);

    try {
      const form = e.currentTarget;
      const url = `${APP_BASE_URL}/api/users/${user.id}`;
      const formData = {
        userId: user.id,
        username: form.username.value,
        currentPassword: form.currentPassword.value,
        newPassword: form.newPassword.value,
      };

      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeDialog();
        onSuccess(form.username.value);
      } else {
        const body = await response.json();
        setIsUpdating(false);
        setError(body?.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsUpdating(false);
      setError({
        server: "Failed to update user. Please try again later.",
      });
    }
  };

  return (
    <>
      {iconButton ? (
        <button onClick={openDialog}>
          <PencilSquareIcon className="size-5 cursor-pointer text-blue-400 hover:text-blue-500" />
        </button>
      ) : (
        <button
          onClick={openDialog}
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Update Profile
        </button>
      )}

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
                  defaultValue={user.username}
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
                <label htmlFor="currentPassword" className="form-label">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="form-input-text"
                />
                {error?.currentPassword?.length &&
                  error.currentPassword.map((error) => (
                    <p key={error} className="form-input-error-text">
                      {error}
                    </p>
                  ))}
              </div>

              <div className="mb-4">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="form-input-text"
                />
                {error?.newPassword?.length &&
                  error.newPassword.map((error) => (
                    <p key={error} className="form-input-error-text">
                      {error}
                    </p>
                  ))}
              </div>

              <div>
                <button type="submit" className="form-submit-button">
                  {isUpdating ? "Updating user..." : "Update User"}
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
