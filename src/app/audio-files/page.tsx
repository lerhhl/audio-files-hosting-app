import { redirectToLoginIfSessionNotFound } from "@/actions/auth";
import AudioFilesPage from "@/components/AudioFilesPage";
import { verifySession } from "@/lib/session";

export default async function HomePageWrapper() {
  await redirectToLoginIfSessionNotFound();
  const { isAuth } = await verifySession();

  return <AudioFilesPage isAuth={isAuth} />;
}
