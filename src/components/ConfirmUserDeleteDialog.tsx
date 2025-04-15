import { APP_BASE_URL } from "@/app/config";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

type ConfirmUserDeleteDialogProps = {
  readonly userId: number;
  readonly username: string;
  readonly isAdmin: boolean;
  readonly onSuccess: () => void;
};

export default function ConfirmUserDeleteDialog({
  userId,
  username,
  isAdmin,
  onSuccess,
}: ConfirmUserDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setError(null);
    setIsDeleting(false);
    setIsOpen(false);
  };

  const confirmDeleteUser = async () => {
    if (userId) {
      setIsDeleting(true);

      try {
        const url = `${APP_BASE_URL}/api/users/${userId}`;

        const response = await fetch(url, { method: "DELETE" });

        if (response.ok) {
          closeDialog();
          onSuccess();
        } else {
          const body = await response.json();
          setIsDeleting(false);
          setError(body?.error);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsDeleting(false);
        setError("Failed to upload audio file. Please try again later.");
      }
    }
  };

  return (
    <>
      <button onClick={openDialog} disabled={isAdmin}>
        <TrashIcon
          className={`size-5 ${
            isAdmin
              ? "text-gray-400"
              : "text-red-400 hover:text-red-500 cursor-pointer"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete user &quot;{username}&quot;?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeDialog}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDeleteUser}
                disabled={isDeleting}
              >
                <div style={{ minWidth: "100px", textAlign: "center" }}>
                  {isDeleting ? "Deleting..." : "Delete User"}
                </div>
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-right">{error}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
