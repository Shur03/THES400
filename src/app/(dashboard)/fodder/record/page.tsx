"use client";

import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useSession } from "next-auth/react";
import { signIn } from "../../../../../lib/auth";
import RecordList from "@/components/page/Fodder/record/RecordList";

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
      <div className="mb-3 text-end pt-5">
        <Button
          variant="success"
          className="text-white bg-green-400 rounded-lg p-2 "
          onClick={() => router.push("/fodder/record/create")}
        >
          + Бүртгэл нэмэх
        </Button>
      </div>
      <RecordList />
      <Footer />
    </div>
  );
}
