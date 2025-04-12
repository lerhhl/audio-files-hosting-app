"use client";

import { createAudioFileRecordAction } from "@/actions/audioFiles";
import { ALLOWABLE_AUDIO_CATEGORIES } from "@/app/constants";
import { UploadVideoFormState } from "@/components/types";
import { useActionState, useEffect, useState } from "react";

export default function CreateAudioFileRecordForm() {
  const [state, action, pending] = useActionState<UploadVideoFormState>(
    // @ts-expect-error ignore type error
    createAudioFileRecordAction,
    { errors: undefined }
  );
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  useEffect(() => {
    if (state?.success) {
      closeDialog();
    }
  }, [state]);

  return (
    <>
      <button
        onClick={openDialog}
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        Upload Audio File
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
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description (max. 100 characters)
                </label>
                <textarea
                  id="description"
                  name="description"
                  maxLength={100}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
                {state?.errors?.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.description}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {ALLOWABLE_AUDIO_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {state?.errors?.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.category}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700"
                >
                  Audio File
                </label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="audio/*"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 1) {
                      alert("Please select only one audio file.");
                      e.target.value = ""; // Clear the invalid selection
                    }
                  }}
                />
                {state?.errors?.file && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.file}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 disabled:opacity-50"
              >
                {pending ? "Uploading..." : "Upload Audio File"}
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
