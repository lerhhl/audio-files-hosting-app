"use client";

import AudioPlayer from "@/components/AudioPlayer";
import HomeButton from "@/components/HomeButton";
import LogoutButton from "@/components/LogoutButton";
import { AudioFiles, CommonComponentProps } from "@/components/types";
import UploadAudioFileForm from "@/components/UploadAudioFileForm";
import { use } from "react";

interface AudioFilesProps extends Omit<CommonComponentProps, "isAdmin"> {
  readonly isAuth: boolean;
  readonly audioFiles: Promise<AudioFiles[]>;
}

export default function AudioFilesPage({
  isAuth,
  audioFiles,
}: AudioFilesProps) {
  const audioFilesList = use(audioFiles);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 bg-gray-100">
      <HomeButton />
      {isAuth && <LogoutButton />}
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Audio Files List
      </h1>
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-1">
          <UploadAudioFileForm />
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-1 py-2">Description</th>
              <th className="border border-gray-300 px-1 py-2">Category</th>
              <th className="border border-gray-300 px-1 py-2">Mime Type</th>
              <th className="border border-gray-300 px-1 py-2">Created At</th>
              <th className="border border-gray-300 px-1 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {audioFilesList.length === 0 ? (
              // If empty, display a message
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No audio files found.
                </td>
              </tr>
            ) : (
              // If not empty, map through the audioFilesList and display each audio file
              audioFilesList.map((audioFile) => (
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
                    {audioFile.createdAt.toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <AudioPlayer fileId={audioFile.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
