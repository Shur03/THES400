"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CircleAlert, ArrowLeft, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>(
    "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу." // Default message
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const error = searchParams?.get("error");

    // If no error param, skip the fetch
    if (!error) {
      setIsLoading(false);
      return;
    }

    const fetchErrorMessage = async () => {
      try {
        const response = await fetch(`/api/auth/error?error=${error}`);
        if (response.ok) {
          const data = await response.json();
          setErrorMessage(data.error);
        }
      } catch (error) {
        console.error("Failed to fetch error message:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrorMessage();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 relative">
              <Image
                src="/img/logo.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <ShieldAlert className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Нэвтрэх алдаа
            </h1>
          </div>

          <div className="flex items-center p-4 mb-6 bg-red-50 rounded-lg">
            <CircleAlert className="h-5 w-5 flex-shrink-0 text-red-500 mr-3" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              Дахин нэвтрэх
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Нүүр хуудас руу буцах
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Бүртгэлгүй юу?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Бүртгүүлэх
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
