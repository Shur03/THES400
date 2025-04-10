"use client";

import StockChart from "@/components/charts/StockChart";
import Footer from "@/components/footer/Footer";
import EventChart from "@/components/page/Stock/EventChart";
import EventList from "@/components/page/Stock/EventList";
import axios from "axios";
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

  const STOCK_TYPES = [
    { id: 1, name: "Хонь" },
    { id: 2, name: "Ямаа" },
    { id: 3, name: "Үхэр" },
    { id: 4, name: "Адуу" },
    { id: 5, name: "Тэмээ" },
  ];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/livestock", formData);
      setFormData({ stock_type: "", counts: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <div className="h-4">
        <h1>Өсөлт хорогдол бүртгэх</h1>
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
