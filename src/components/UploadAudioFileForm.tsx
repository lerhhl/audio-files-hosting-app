"use client";

import { createAudioFileRecordAction } from "@/actions/audioFiles";
import {
  ALLOWABLE_AUDIO_CATEGORIES,
  MAX_FILE_UPLOAD_SIZE,
} from "@/app/constants";
import { UploadVideoFormState } from "@/components/types";
import { AUDIO_FILE_SPEC } from "@/lib/formDefinitions";
import { useState } from "react";

export default function CreateAudioFileRecordForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] =
    useState<UploadVideoFormState["errors"]>(undefined);
  const [pending, setPending] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setErrors(undefined);
    setPending(false);
    setIsOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setErrors(undefined);
    const formData = new FormData(e.currentTarget);
    const fileInput = formData.get("file") as File;

    if (fileInput?.size > MAX_FILE_UPLOAD_SIZE.bytes) {
      setErrors((prev) => ({
        ...prev,
        file: [`File size must be less than ${MAX_FILE_UPLOAD_SIZE.mb}MB.`],
      }));
      setPending(false);
      return;
    }

    const response = await createAudioFileRecordAction(formData);

    if (!response.success) {
      setErrors(response.errors);
      setPending(false);
    } else {
      closeDialog();
    }
  };

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
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  {`Description (max. ${AUDIO_FILE_SPEC.description.max.value} characters)`}
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
                {errors?.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
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
                {errors?.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
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
                />
                {errors?.file && (
                  <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 disabled:opacity-50"
              >
                {pending ? "Uploading..." : "Upload Audio File"}
              </button>
              {errors?.server && (
                <p className="text-red-500 text-sm">{errors?.server}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
