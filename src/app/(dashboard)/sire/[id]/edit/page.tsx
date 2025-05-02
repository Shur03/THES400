"use client";

import { use } from "react"; // Import React.use
import SireForm from "@/components/page/Sire/SireForm";
import BackButton from "@/components/shared/buttons/backButton";
import StockType from "@/models/StockType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const STOCK_TYPES = Object.entries(StockType).map(([id, name]) => ({
  id: parseInt(id),
  name,
}));

export default function EditSiretPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [formData, setFormData] = useState({
    stock_id: 0,
    name: "",
    breed: "",
    age: 0,
    year: "",
    weight: "",
    type: "",
  });
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [state, setState] = useState<{
    message: string;
    success: boolean;
    errors?: Record<string, string[]>;
  }>({ message: "", success: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchSire = async () => {
      try {
        const response = await fetch(`/api/sires/${id}`);
        if (!response.ok) throw new Error("Failed to fetch sire");

        const data = await response.json();
        setFormData({
          stock_id: data.stock_id,
          name: data.name,
          breed: data.breed,
          age: data.age,
          year: data.year,
          weight: data.weight,
          type: data.type,
        });
      } catch (error) {
        console.error("Error fetching sire:", error);
        setState({
          message: "Алдаа гарлаа. Дахин оролдоно уу.",
          success: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSire();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock_id" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/sires/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setState({ message: "Амжилттай шинэчлэгдлээ!", success: true });
        router.push("/sire");
      } else {
        setState({
          message: result.error || "Алдаа гарлаа, дахин оролдоно уу.",
          success: false,
          errors: result.errors,
        });
      }
    } catch (error) {
      setState({ message: "Алдаа гарлаа. Дахин оролдоно уу.", success: false });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Малын бүртгэл</h2>

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

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="stock_type">
            Малын төрөл
          </label>
          <div className="flex gap-2">
            <select
              id="stock_type"
              name="stock_type"
              value={formData.stock_id}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  stock_id: Number(e.target.value),
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Зүс
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              state.errors?.name ? "border-red-500" : ""
            }`}
          />
          {state.errors?.name && (
            <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="breed">
            Үүлдэр
          </label>
          <textarea
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="age">
            Нас
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="weight">
            Жин
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="year">
            Он
          </label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Жил сонгоно уу</option>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Хадгалаж байна..." : "Хадгалах"}
          </Button>

          <BackButton />
        </div>
      </form>
    </div>
  );
}
