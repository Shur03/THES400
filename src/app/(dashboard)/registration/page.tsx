"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import EventChart from "@/components/page/Stock/EventChart";
import EventList from "@/components/page/Stock/EventList";
import AddButton from "@/components/shared/buttons/addButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function Page() {
  const router = useRouter();
  const pageName = "Өсөлт хорогдлын бүртгэл";
  const [formData, setFormData] = useState({
    stock_type: "",
    counts: "",
  });
  const [state, setState] = useState<{
    message: string;
    success: boolean;
    errors?: Record<string, string[]>;
  }>({ message: "", success: false });
  const { data: session, status } = useSession();
  if (!session) {
    return <p className="text-gray-900">Нэвтэрнэ үү</p>;
  }
  return (
    <div>
      <Header pageName={pageName} username={session.user?.name || "Guest"} />
      <div className="h-4">
        {/** Өсөлт хорогдлыг графикаар харуулах */}
        {/* <EventChart /> */}
        <AddButton path="registration" />
        <EventList />
        <Footer />
      </div>
    </div>
  );
}
