import { getAllAudioFilesByUsernameAction } from "@/actions/audioFiles";
import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import AudioFilesPage from "@/components/AudioFilesPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { verifySession } from "@/lib/session";
import { Suspense } from "react";

export default async function AudioFilesWrapper() {
  await redirectToLoginIfSessionNotFound();
  const { isAuth } = await verifySession();
  const audioFiles = getAllAudioFilesByUsernameAction();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AudioFilesPage isAuth={isAuth} audioFiles={audioFiles} />;
    </Suspense>
  );
}
