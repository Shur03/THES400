"use client";

import { useRouter } from "next/navigation";
import PurchaseList from "@/components/page/Fodder/purchase/PurchaseList";
import Header from "@/components/header/Header";
import { useSession } from "next-auth/react";

import Footer from "@/components/footer/Footer";
import { Button } from "react-bootstrap";
import { signIn } from "../../../../lib/auth";
import SireList from "@/components/page/Sire/SireList";
import AddButton from "@/components/shared/buttons/addButton";

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
      <AddButton path="sire" />
      <SireList />
      <Footer />
    </div>
  );
}
