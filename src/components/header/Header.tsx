"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "react-bootstrap";
import NotificationDropdown from "../notifications/notification-dropdown";
import { useState } from "react";

interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  const { data: session } = useSession();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State to toggle visibility

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev); // Toggle dropdown visibility
  };

  return (
    <header className="bg-gray-100 shadow-md p-4 rounded-lg mb-3">
      <div className="container mx-auto flex justify-between items-center rounded-lg">
        <Link href="/" className="text-xl text-gray-800">
          <span className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Малчны туслах
          </span>
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                id="user-menu-button"
                className="flex items-center gap-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={toggleDropdown}
                aria-expanded={isDropdownVisible}
                aria-haspopup="true"
              >
                <User className="w-5 h-5 text-gray-700" />
                {username && (
                  <span className="sr-only sm:not-sr-only sm:block text-sm font-medium text-gray-700">
                    {username}
                  </span>
                )}
              </Button>

              {isDropdownVisible && (
                <div
                  className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {username}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Гарах</span>
                  </button>
                </div>
              )}
            </div>
            <NotificationDropdown />
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
