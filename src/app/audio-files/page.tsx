import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import AudioFilesList from "@/components/AudioFilesList";
import LoadingSpinner from "@/components/LoadingSpinner";
import TopNavigationBarProps from "@/components/TopNavigationBar";
import { Suspense } from "react";

export default async function AudioFilesWrapper() {
  const session = await redirectToLoginIfSessionNotFound();

  return (
    <>
      <TopNavigationBarProps session={session} />
      <Suspense fallback={<LoadingSpinner />}>
        <AudioFilesList />;
      </Suspense>
    </>
  );
}
