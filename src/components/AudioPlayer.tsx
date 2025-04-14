"use client";

import { AUDIO_FILES_PATH } from "@/app/constants";
import { useOutsideClickHandler } from "@/app/hooks/useOutsideClickHandler";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";

type AudioPlayerProps = {
  readonly fileId: number;
};

export default function AudioPlayer({ fileId }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioFileUrl = `/api${AUDIO_FILES_PATH}/${fileId}`;
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handlePlayAudioFile = () => {
    setIsPlaying(true);
  };

  const handleEndedAudioFile = () => {
    setIsPlaying(false);
  };

  useOutsideClickHandler(dialogRef, setIsPlaying, isPlaying);

  return (
    <>
      <button onClick={handlePlayAudioFile}>
        <PlayCircleIcon className="size-5 text-green-400 cursor-pointer" />
      </button>

      {isPlaying && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div ref={dialogRef}>
            <audio
              controls
              autoPlay
              src={audioFileUrl}
              onAbort={handleEndedAudioFile}
              controlsList="nodownload nofullscreen noremoteplayback"
            >
              <track
                kind="captions"
                src={audioFileUrl}
                srcLang="en"
                label="English"
              />
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      )}
    </>
  );
}
