"use client";

import { APP_BASE_URL } from "@/app/config";
import { DEFAULT_HOME_PATH } from "@/app/constants";
import { redirect } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    try {
      const form = e.currentTarget;
      const url = `${APP_BASE_URL}/api/login`;
      const formData = {
        username: form.username.value,
        password: form.password.value,
      };

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const body = await response.json();
        setError(body.message ?? "An error occurred during login");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (success) {
      redirect(DEFAULT_HOME_PATH);
    }
  }, [success]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-100">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Welcome to Audio File Hosting App
      </h1>
      <form
        onSubmit={handleLogin}
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
          disabled={isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Login
        </button>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      </form>
    </div>
  );
}
