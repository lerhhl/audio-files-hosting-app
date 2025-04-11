import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import AudioFilesPage from "@/components/AudioFilesPage";

export default async function HomePageWrapper() {
  await redirectToLoginIfSessionNotFound();

  return <AudioFilesPage />;
}
