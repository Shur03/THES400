"use client";
import Header from "@/components/header/Header";
import SideNav from "@/components/shared/dashboard/sidenav";
import { signIn, useSession } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  if (!session) {
    return (
      <div>
        <p>Нэвтэрнэ үү.</p>
        <button onClick={() => signIn()}>Нэвтрэх</button>
      </div>
    );
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-52 bg-gray-800">
        <SideNav />
      </div>

      <Header username={session.user?.name || "Guest"} />
      <div className="grow p-6 md:overflow-y-auto bg-white">{children}</div>
    </div>
  );
}
