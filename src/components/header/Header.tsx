"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl  text-gray-800">
          🐑 Малчны туслах
        </Link>

        {/* Authenticated User Actions */}
        {session ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full shadow">
              <span className="text-gray-800 font-semibold">{username}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut />
            </button>
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition"
          >
            Нэвтрэх
          </Link>
        )}
      </div>
    </header>
  );
}
