"use client";

import StockChart from "@/components/charts/StockChart";
import Footer from "@/components/footer/Footer";
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
      {/* <div className="p-4 text-gray-900">
        <h2 className="text-xl font-bold mb-4">Малын бүртгэл</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="stock_type">
              Малын төрөл
            </label>
            <div className="flex gap-2">
              <select
                id="stock_type"
                name="stock_type"
                value={formData.stock_type}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    stock_type: e.target.value,
                  });
                }}
                className={`flex-1 px-3 py-2 border rounded-md ${
                  state.errors?.stock_id ? "border-red-500" : ""
                }`}
              >
                <option value="0">-- Сонгох --</option>
                {STOCK_TYPES.map((stock) => (
                  <option key={stock.id} value={stock.id}>
                    {stock.name}
                  </option>
                ))}
              </select>
            </div>
            {state.errors?.stock_id && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.stock_id[0]}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1">Тоо</label>
            <input
              type="number"
              name="counts"
              value={formData.counts}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Малын бүртгэл нэмэх
          </button>
        </form>
      </div> */}
      <div className="h-4">
        <h1>Өсөлт хорогдол бүртгэх</h1>
        {/** Өсөлт хорогдлыг графикаар харуулах */}
        <StockChart />
        <EventList />
        <Footer />
      </div>
    </div>
  );
}
