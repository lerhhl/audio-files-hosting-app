import LogoutButton from "@/components/LogoutButton";
import { verifySession } from "@/lib/session";

export default async function HomePage() {
  const { isAuth, isAdmin } = await verifySession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-100">
      {isAuth && <LogoutButton />}
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Welcome to Audio File Hosting App
      </h1>

      <div className="flex space-x-4">
        {isAdmin && (
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer">
            Users Management
          </button>
        )}
        <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 cursor-pointer">
          Audio Files List
        </button>
      </div>
    </div>
  );
}
