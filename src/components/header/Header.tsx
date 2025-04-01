"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
interface HeaderProps {
  username: string;
}

export default function Header(username: HeaderProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className=" text-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {session ? (
          <div className="flex flex-row space-between">
            <h2 className="text-gray-900">{username}</h2>
            <button onClick={() => signOut()} className="hover:underline">
              Гарах
            </button>
          </div>
        ) : (
          <Link href="/auth/signin" className="hover:underline">
            Нэвтрэх
          </Link>
        )}
      </div>
    </header>
  );
}
