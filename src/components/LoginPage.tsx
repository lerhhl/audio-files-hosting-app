"use client";

import { login } from "@/actions/auth";
import { DEFAULT_HOME_PATH } from "@/app/constants";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.success) {
      // Redirect to the home page on successful login
      redirect(DEFAULT_HOME_PATH);
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-100">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Welcome to Audio File Hosting App
      </h1>
      <form
        action={action}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="string"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Login
        </button>
        {!state?.success && (
          <p className="text-red-500 text-sm mb-4">{state?.message}</p>
        )}
      </form>
    </div>
  );
}
