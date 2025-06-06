"use client";

import { AtSign, CircleAlert, Link, LockKeyhole, User } from "lucide-react";
import { executeAction } from "../../../../lib/executeAction";
import { useLogin } from "@/app/hooks/useLogin";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Footer from "@/components/footer/Footer";
import { Button } from "react-bootstrap";

export default function Login() {
  const { submitting, error, handleLogin } = useLogin();
  const router = useRouter();
  const handleClick = () => {
    router.replace("/register"); // Hard navigation without adding to history
  };
  return (
    <div className="items-center justify-center flex flex-col md:flex-row ">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">
              Нэвтрэх
            </h1>
            <p className="text-gray-600 mb-8 text-center md:text-left">
              Бүртгэлтэй хэрэглэгчдийн нууц хуудсанд нэвтрэнэ үү
            </p>

            <form
              action={async (formData: FormData) => {
                await executeAction({
                  actionFn: () => handleLogin(formData),
                });
              }}
              className="space-y-6"
            >
              {/* Phone input */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Утасны дугаар
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-800" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    disabled={submitting}
                    placeholder="Утасны дугаараа оруулна уу"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Нууц үг
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockKeyhole className="h-5 w-5 text-gray-800" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    minLength={6}
                    disabled={submitting}
                    placeholder="Нууц үгээ оруулна уу"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center p-4 bg-red-50 rounded-lg">
                  <CircleAlert className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Нэвтэрч байна...
                  </span>
                ) : (
                  "Нэвтрэх"
                )}
              </Button>

              {/* Register link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Бүртгэлгүй юу?{" "}
                  <Button
                    type="button"
                    onClick={handleClick}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Бүртгүүлэх
                  </Button>
                </p>
              </div>
            </form>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
