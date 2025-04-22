"use client";

import { useRouter } from "next/navigation";
import PurchaseList from "@/components/page/Fodder/purchase/PurchaseList";
import Header from "@/components/header/Header";
import { useSession } from "next-auth/react";
import { signIn } from "../../../../../lib/auth";
import Footer from "@/components/footer/Footer";
import { Button } from "react-bootstrap";
import AddButton from "@/components/shared/buttons/addButton";
import FodderList from "@/components/page/Fodder/FodderList";

export default function Page() {
  const router = useRouter();

  const { data: session } = useSession();
  if (!session) {
    return (
      <div>
        <button className="bg-blue-400 text-gray-900" onClick={() => signIn()}>
          Нэвтрэх
        </button>
      </div>
    );
  }
  return (
    <div className="mx-5 rounded-lg p-4">
      <Header username={session.user?.name ?? ""} />
      <div className="flex flex-row justify-between items-center mb-4">
        <FodderList />
        <AddButton path="fodder/purchase" />
      </div>
      <PurchaseList />
      <Footer />
    </div>
  );
}
