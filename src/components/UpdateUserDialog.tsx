import { APP_BASE_URL } from "@/app/config";
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
        <div
          className="fixed inset-0 flex justify-center items-center z-50 text-left"
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
                  defaultValue={user.username}
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
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {error?.currentPassword?.length &&
                  error.currentPassword.map((error) => (
                    <p key={error} className="text-red-500 text-sm mt-1">
                      {error}
                    </p>
                  ))}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {error?.newPassword?.length &&
                  error.newPassword.map((error) => (
                    <p key={error} className="text-red-500 text-sm mt-1">
                      {error}
                    </p>
                  ))}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 disabled:opacity-50"
              >
                {isUpdating ? "Updating user..." : "Update User"}
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
