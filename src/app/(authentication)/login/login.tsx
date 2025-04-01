"use client";

import {
  Button,
} from "react-bootstrap";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {  AtSign, CircleAlert, LockKeyhole } from "lucide-react";
import { auth } from "../../../../lib/auth";
import { executeAction } from "../../../../lib/executeAction";

export default function Login({ callbackUrl }: { callbackUrl: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


  return (
    <form action={async(formData: FormData)=> {
      // "use server";
      await executeAction({
        actionFn: async() => {
          await signIn('credentials', {
            phone: formData.get('phone'),
            password: formData.get('password'),
            redirect: true,
            callbackUrl: '/dashboard'
          })
        }
      })
    }}>
      <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
        <div>
          <label
            className="mb-3 mt-5 block text-xs text-gray-900 font-medium"
            htmlFor="phone"
          >
            Утасны дугаар
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2"
              id="phone"
              type="phone"
              name="phone"
              placeholder="Утасны дугаараа оруулна уу."
              required
              disabled={submitting}
            />
            <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
        </div>
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-xs text-gray-900 font-medium"
            htmlFor="password"
          >
            Нууц үг
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2"
              id="password"
              type="password"
              name="password"
              placeholder="Нууц үг оруулна уу."
              required
              minLength={6}
              disabled={submitting}
            />
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
        </div>

        <div className="mt-4">
          <Button
            type="submit"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            disabled={submitting}
          >
            Нэвтрэх
          </Button>
        </div>
        <div className="mt-4 text-gray-900">
          <Link href="#">Нууц үг сэргээх</Link>
        </div>

        {error && (
          <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
            <CircleAlert className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </div>
    </form>
  );
}
