"use client";

import { useActionState } from "react";
import { ArrowRightIcon, AtSign, CircleAlert, LockKeyhole } from "lucide-react";

import { Button } from "../ui/button";
import { authenticate } from "@/app/lib/actions/user.actions";
import { useRouter } from "next/router";

export default function LoginForm() {
  // const router = useRouter();
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  // if (errorMessage?.success) {
  //   router.push("/dashboard");

  return (
    <form action={formAction}>
      <div className="flex-1 rounded-lg  px-6 pb-4 pt-8 ">
        {/* <h1 className={`${lusitana.className} mb-3 text-2xl`}> */}
        <h1 className="mb-3 text-2xl">hhh.</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="email"
            >
              Утасны дугаар
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border   py-[9px] pl-10 text-sm outline-2  "
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2   " />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium  "
              htmlFor="password"
            >
              Нууц үг
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border   py-[9px] pl-10 text-sm outline-2 "
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button
            type="submit"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            disabled={isPending}
          >
            Нэвтрэх
          </Button>
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <CircleAlert className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
