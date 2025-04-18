import AudioFilesManagement from "@/components/AudioFilesManagement";
import LoadingSpinner from "@/components/LoadingSpinner";
import TopNavigationBarProps from "@/components/TopNavigationBar";
import { redirectToLoginIfSessionNotFound } from "@/lib/auth";
import { Suspense } from "react";

export default async function AudioFilesWrapper() {
  const session = await redirectToLoginIfSessionNotFound();

  return (
    <>
      <TopNavigationBarProps session={session} />
      <Suspense fallback={<LoadingSpinner />}>
        <AudioFilesManagement />;
      </Suspense>
    </>
  );
}
