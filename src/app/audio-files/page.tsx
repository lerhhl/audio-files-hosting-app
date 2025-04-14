import { getAllAudioFilesByUsernameAction } from "@/actions/audioFiles";
import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import AudioFilesList from "@/components/AudioFilesList";
import LoadingSpinner from "@/components/LoadingSpinner";
import TopNavigationBarProps from "@/components/TopNavigationBar";
import { verifySession } from "@/lib/session";
import { Suspense } from "react";

export default async function AudioFilesWrapper() {
  await redirectToLoginIfSessionNotFound();
  const session = await verifySession();
  const audioFiles = getAllAudioFilesByUsernameAction();

  return (
    <>
      <TopNavigationBarProps session={session} />
      <Suspense fallback={<LoadingSpinner />}>
        <AudioFilesList audioFiles={audioFiles} />;
      </Suspense>
    </>
  );
}
