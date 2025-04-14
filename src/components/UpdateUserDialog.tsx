import { updateUserAction } from "@/actions/user";
import { UpdateUserFormState } from "@/components/types";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useActionState, useCallback, useEffect, useState } from "react";

export type UpdateUserDialogProps = {
  readonly iconButton?: boolean;
  readonly user: {
    readonly id?: number;
    readonly username?: string;
  };
  readonly onSuccess?: () => void;
};

export default function UpdateUserDialog({
  user,
  iconButton = true,
  onSuccess,
}: UpdateUserDialogProps) {
  const [state, action, pending] = useActionState<UpdateUserFormState>(
    // @ts-expect-error ignore type error
    updateUserAction,
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
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [state, closeDialog, onSuccess]);

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
          Update User
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

            <form className="flex flex-col gap-4" action={action}>
              <div className="mb-4">
                <input
                  id="userId"
                  name="userId"
                  type="string"
                  defaultValue={user.id}
                  hidden
                />

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
                {state?.errors?.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.username}
                  </p>
                )}
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
                {state?.errors?.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.currentPassword}
                  </p>
                )}
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
                {state?.errors?.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.newPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 disabled:opacity-50"
              >
                {pending ? "Updating user..." : "Update User"}
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
