"use client";

import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useSession } from "next-auth/react";
import { signIn } from "../../../../../lib/auth";
import RecordList from "@/components/page/Fodder/record/RecordList";
import AddButton from "@/components/shared/buttons/addButton";
import FodderList from "@/components/page/Fodder/FodderList";

export default function Page() {
  const router = useRouter();
  const pageName = "Өвс тэжээллийн зарцуулалт";
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
      <div className="flex flex-row justify-between items-center mb-4">
        <FodderList />
        <AddButton path="fodder/record" />
      </div>

      <RecordList />
      <Footer />
    </div>
  );
}
