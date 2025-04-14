"use client";

import { APP_BASE_URL } from "@/app/config";
import AudioPlayer from "@/components/AudioPlayer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { AudioFiles } from "@/components/types";
import UploadAudioFileForm from "@/components/UploadAudioFileForm";
import { calculateTotalPages, generateHeaders } from "@/components/utils";
import { useCallback, useEffect, useState } from "react";

export default function AudioFilesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [audioFiles, setAudioFiles] = useState<AudioFiles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

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
      setAudioFiles(data.items ?? []);
      setTotalPages(calculateTotalPages(data.totalCount, itemsPerPage));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setAudioFiles([]);
      setTotalPages(0);
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
    <div className="flex flex-col items-center justify-start bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Audio Files List
      </h1>

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
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-1 py-2">
                  Description
                </th>
                <th className="border border-gray-300 px-1 py-2">Category</th>
                <th className="border border-gray-300 px-1 py-2">Mime Type</th>
                <th className="border border-gray-300 px-1 py-2">Created At</th>
                <th className="border border-gray-300 px-1 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {audioFiles.length === 0 ? (
                // If empty, display a message
                <tr>
                  <td
                    colSpan={5}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {error ?? "No audio files found."}
                  </td>
                </tr>
              ) : (
                // If not empty, map through the audioFilesList and display each audio file
                audioFiles.map((audioFile) => (
                  <tr key={audioFile.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {audioFile.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {audioFile.category}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {audioFile.mimeType}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(audioFile.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <AudioPlayer fileId={audioFile.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
