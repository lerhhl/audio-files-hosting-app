import LogoutButton from "@/components/LogoutButton";
import { verifySession } from "@/lib/session";

export default async function AudioFilesPage() {
  const { isAuth } = await verifySession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-100">
      {isAuth && <LogoutButton />}
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Welcome to Audio Files List
      </h1>
    </div>
  );
}
