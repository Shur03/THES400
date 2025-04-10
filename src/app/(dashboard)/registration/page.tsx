"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import EventChart from "@/components/page/Stock/EventChart";
import EventList from "@/components/page/Stock/EventList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function Page() {
  const router = useRouter();
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
    return <p>Нэвтэрнэ үү</p>;
  }
  return (
    <div>
      <Header username={session.user?.name || "Guest"} />
      <div className="h-4">
        {/** Өсөлт хорогдлыг графикаар харуулах */}
        <EventChart />
        <Button
          variant="success"
          className="text-white bg-green-400 text-sm lg:text-lg rounded-lg p-2 mt-3  "
          onClick={() => router.push("/registration/create")}
        >
          + Нэмэх
        </Button>
        <EventList />
        <Footer />
      </div>
    </div>
  );
}
