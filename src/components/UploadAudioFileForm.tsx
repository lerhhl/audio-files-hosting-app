"use client";

import { APP_BASE_URL } from "@/app/config";
import {
  ALLOWABLE_AUDIO_CATEGORIES,
  MAX_FILE_UPLOAD_SIZE,
} from "@/app/constants";
import CloseDialogButton from "@/components/CloseDialogButton";
import { UploadVideoFormErrors } from "@/components/types";
import { AUDIO_FILE_SPEC } from "@/lib/formDefinitions";
import { FormEvent, useState } from "react";

type CreateAudioFileRecordFormProps = {
  readonly onSuccess: () => void;
};

export default function CreateAudioFileRecordForm({
  onSuccess,
}: CreateAudioFileRecordFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<UploadVideoFormErrors | undefined>(
    undefined
  );
  const [updating, setUpdating] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setError(undefined);
    setUpdating(false);
    setIsOpen(false);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    setError(undefined);

    try {
      const formData = new FormData(e.currentTarget);
      const fileInput = formData.get("file") as File;

      if (fileInput?.size > MAX_FILE_UPLOAD_SIZE.bytes) {
        setError((prev) => ({
          ...prev,
          file: [`File size must be less than ${MAX_FILE_UPLOAD_SIZE.mb}MB.`],
        }));
        setUpdating(false);
        return;
      }
      const url = `${APP_BASE_URL}/api/audio-files`;

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUpdating(false);
        closeDialog();
        onSuccess();
      } else {
        const body = await response.json();
        setUpdating(false);
        setError(body?.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setUpdating(false);
      setError({
        server: "Failed to upload audio file. Please try again later.",
      });
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
        <div className="form-dialog-background">
          <div className="form-dialog-body">
            <CloseDialogButton closeDialog={closeDialog} />
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="description" className="form-label">
                  {`Description (max. ${AUDIO_FILE_SPEC.description.max.value} characters)`}
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input-text"
                  rows={4}
                  required
                />
                {error?.description?.length &&
                  error.description.map((error) => (
                    <p key={error} className="form-input-error-text">
                      {error}
                    </p>
                  ))}
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-input-text"
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
                {error?.category?.length &&
                  error.category.map((error) => (
                    <p key={error} className="form-input-error-text">
                      {error}
                    </p>
                  ))}
              </div>

              <div className="mb-4">
                <label htmlFor="file" className="form-label">
                  Audio File
                </label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="audio/*"
                  className="form-input-text"
                  required
                />
                {error?.file?.length &&
                  error.file.map((error) => (
                    <p key={error} className="form-input-error-text">
                      {error}
                    </p>
                  ))}
              </div>

              <div>
                <button type="submit" className="form-submit-button">
                  {updating ? "Uploading..." : "Upload Audio File"}
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
