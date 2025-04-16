"use client";

import { APP_BASE_URL } from "@/app/config";
import AudioPlayer from "@/components/AudioPlayer";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { AudioFile } from "@/components/types";
import UploadAudioFileForm from "@/components/UploadAudioFileForm";
import { calculateTotalPages, generateHeaders } from "@/components/utils";
import { useCallback, useEffect, useState } from "react";

export default function AudioFilesManagement() {
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const fetchAudioFiles = useCallback(async () => {
    setIsLoading(true);
    const url = `${APP_BASE_URL}/api/audio-files`;

    try {
      const headers = generateHeaders();
      const response = await fetch(
        `${url}?page=${currentPage}&pageSize=${itemsPerPage}`,
        {
          method: "GET",
          headers,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error();
      }

      setAudioFiles(data.items ?? []);
      setTotalPages(calculateTotalPages(data.totalCount, itemsPerPage));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setAudioFiles([]);
      setTotalPages(1);
      setError("Failed to fetch audio files. Please try again later.");
      return;
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAudioFiles();
  }, [currentPage, fetchAudioFiles]);

  return (
    <div className="list-page">
      <h1 className="list-page-header">Audio Files Management</h1>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <div className="w-full max-w-4xl">
          <div className="flex justify-end mb-1">
            <UploadAudioFileForm onSuccess={fetchAudioFiles} />
          </div>
          <table className="table">
            <thead>
              <tr className="table-header-row-cell">
                <th className="table-row-cell-text">Description</th>
                <th className="table-row-cell-text">Category</th>
                <th className="table-row-cell-text">Mime Type</th>
                <th className="table-row-cell-text">Created At</th>
                <th className="table-row-cell-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {audioFiles.length === 0 ? (
                // If empty, display a message
                <tr>
                  <td colSpan={5} className="table-row-cell-text text-center">
                    {error ?? "No audio files found."}
                  </td>
                </tr>
              ) : (
                // If not empty, map through the audioFilesList and display each audio file
                audioFiles.map((audioFile) => (
                  <tr key={audioFile.id} className="text-center">
                    <td className="table-row-cell-text">
                      {audioFile.description}
                    </td>
                    <td className="table-row-cell-text">
                      {audioFile.category}
                    </td>
                    <td className="table-row-cell-text">
                      {audioFile.mimeType}
                    </td>
                    <td className="table-row-cell-text">
                      {new Date(audioFile.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-row-cell-text">
                      <AudioPlayer fileId={audioFile.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        </div>
      )}
    </div>
  );
}
