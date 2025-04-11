"use client";

import { DEFAULT_HOME_PATH } from "@/app/constants";
import { redirect } from "next/navigation";

export default function HomeButton() {
  const handleClick = () => {
    redirect(DEFAULT_HOME_PATH);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-1 px-2 rounded fixed top-2 left-2 z-50"
      type="button"
    >
      Home
    </button>
  );
}
