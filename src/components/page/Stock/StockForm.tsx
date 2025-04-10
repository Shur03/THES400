"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Note: Changed from next/router to next/navigation
import { create } from "@/app/(dashboard)/stock/create/action";

const STOCK_TYPES = [
  { id: "sheep", name: "Хонь" },
  { id: "goat", name: "Ямаа" },
  { id: "horse", name: "Морь" },
  { id: "camel", name: "Тэмээ" },
  { id: "cattle", name: "Үхэр" },
];

export default function StockForm() {
  const router = useRouter();
  const [state, setState] = useState<{
    message: string;
    success: boolean;
    errors?: Record<string, string[]>;
  }>({ message: "", success: false });

  const [formData, setFormData] = useState({
    type: "",
    counts: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState({ message: "", success: false, errors: undefined });
    if (formData.counts <= 0) {
      setState({
        message: "Тоо толгой 0-ээс их байх ёстой!",
        success: false,
        errors: {
          count: ["Тоо толгой 0-ээс их байх ёстой."],
        },
      });
      return;
    }

    if (!formData.type) {
      setState({
        message: "Төрөл сонгоно уу!",
        success: false,
        errors: {
          type: ["Төрөл сонгоно уу"],
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await create(formData);

      if (result.success) {
        setState({
          message: "Амжилттай хадгалагдлаа!",
          success: true,
        });
        setFormData({
          type: "",
          counts: 0,
        });
        router.push("/stock");
      } else {
        setState({
          message: result.message || "Алдаа гарлаа, дахин оролдоно уу",
          success: false,
          errors: result.errors,
        });
      }
    } catch (error) {
      setState({
        message: "Алдаа гарлаа, дахин оролдоно уу",
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "counts" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="text-gray-900">
      {state.message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            state.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div className="font-bold">
            {state.success ? "Амжилттай!" : "Алдаа!"}
          </div>
          <div>{state.message}</div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="type">
            Малын төрөл
          </label>
          <div className="flex gap-2">
            <select
              id="type"
              name="type" // Changed from stock_type to type to match formData
              value={formData.type}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border rounded-md"
              required
            >
              <option value="">-- Сонгох --</option>
              {STOCK_TYPES.map((stock) => (
                <option key={stock.id} value={stock.id}>
                  {stock.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block mb-1">Тоо</label>
          <input
            type="number"
            name="counts"
            value={formData.counts}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Бүртгэж байна..." : "Малын бүртгэл нэмэх"}
        </button>
      </form>
    </div>
  );
}
