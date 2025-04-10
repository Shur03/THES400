"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { Button } from "react-bootstrap";

interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-100 shadow-md p-4 rounded-lg mb-3">
      <div className="container mx-auto flex justify-between items-center rounded-lg ">
        <Link href="/" className="text-xl  text-gray-800">
          <span className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Малчны туслах
          </span>
        </Link>
        {session ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full shadow">
              {/* <span className="text-gray-800 font-semibold">{username}</span> */}
              <Button
                onClick={() => signOut()}
                className="flex items-center gap-2"
              >
                <User className="text-gray-900" />
              </Button>
            </div>
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
