"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import { useSession } from "next-auth/react";

import Footer from "@/components/footer/Footer";
import { signIn } from "../../../../lib/auth";
import SireList from "@/components/page/Sire/SireList";
import AddButton from "@/components/shared/buttons/addButton";

export default function Page() {
  const pageName = "Эцэг малын бүртгэл";

  const { data: session } = useSession();
  if (!session) {
    return (
      <div>
        <h2 className="bg-blue-400 text-gray-900">Түр хүлээнэ үү</h2>
      </div>
    );
  }
  return (
    <div className="mx-5 rounded-lg p-4">
      <Header pageName={pageName} username={session.user?.name ?? ""} />
      <AddButton path="sire" />
      <SireList />
      <Footer />
    </div>
  );
}
