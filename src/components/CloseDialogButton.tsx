"use client";

type CloseDialogButtonProps = {
  readonly closeDialog: () => void;
};

export default function CloseDialogButton({
  closeDialog,
}: CloseDialogButtonProps) {
  return (
    <button
      onClick={closeDialog}
      className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
    >
      &times;
    </button>
  );
}
