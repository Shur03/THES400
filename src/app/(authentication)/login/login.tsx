"use client";

import { Button } from "react-bootstrap";
import Link from "next/link";
import { AtSign, CircleAlert, LockKeyhole } from "lucide-react";
import { executeAction } from "../../../../lib/executeAction";
import { useLogin } from "@/app/hooks/useLogin";

export default function Login() {
  const { submitting, error, handleLogin } = useLogin();

  return (
    <div className="flex h-screen items-center justify-center ">
      <form
        action={async (formData: FormData) => {
          await executeAction({
            actionFn: () => handleLogin(formData),
          });
        }}
        className="p-8 bg-blue-200  rounded shadow-md w-96"
      >
        <div>
          <label
            htmlFor="phone"
            className="mb-3 mt-5 block text-xs text-gray-900 font-medium"
          >
            Утасны дугаар
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              disabled={submitting}
              placeholder="Утасны дугаараа оруулна уу."
              className="peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2"
            />
            <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
        </div>
        <div className="mt-4">
          <label
            htmlFor="password"
            className="mb-3 mt-5 block text-xs text-gray-900 font-medium"
          >
            Нууц үг
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              required
              minLength={6}
              disabled={submitting}
              placeholder="Нууц үг оруулна уу."
              className="peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2"
            />
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
        </div>
        <div className="mt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Нэвтрэх
          </Button>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Бүртгүүлэх
          </Button>
        </div>
        {error && (
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            <CircleAlert className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
