"use client";
import { Button, Alert, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FodderTypeMap from "@/models/FodderTypeMap";
import PageProps from "@/components/props/pageprop";

const FODDER_TYPE = Object.entries(FodderTypeMap).map(([type, name]) => ({
  type,
  name,
}));

export default function EditPurchase({ params }: PageProps<{ id: string }>) {
  const [formData, setFormData] = useState({
    type: "",
    weight: "",
    counts: "",
    buy_date: "",
    price: "",
  });
  const [state, setState] = useState<{
    message: string;
    success: boolean;
    errors?: Record<string, string[]>;
  }>({ message: "", success: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const response = await fetch(`/api/fodders/purchase/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch purchase");
        }
        const data = await response.json();
        setFormData({
          type: data.type,
          weight: data.weight,
          counts: data.counts,
          price: data.price,
          buy_date: data.buy_date ? data.buy_date.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error fetching purchase:", error);
        setState({
          message: "Алдаа гарлаа. Дахин оролдоно уу.",
          success: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [params.id]);

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
    if (
      (formData.type === "uvs" && !formData.counts) ||
      (formData.type === "tejeel" && !formData.weight)
    ) {
      setState({
        message: "Талбарыг бүрэн бөглөнө үү.",
        success: false,
      });
      setIsSubmitting(false);
      return;
    }

    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/fodders/purchase/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setState({
          message: "Бүртгэл амжилттай шинэчлэгдлээ!",
          success: true,
        });
        router.push("/fodder/purchase");
      } else {
        setState({
          message: result.error || "Алдаа гарлаа, дахин оролдоно уу.",
          success: false,
          errors: result.errors,
        });
      }
    } catch (error) {
      setState({
        message: "Алдаа гарлаа. Дахин оролдоно уу.",
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-sm text-gray-800">Ачаалж байна...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Худалдан авалт засварлах</h2>

      {state.message && (
        <Alert variant={state.success ? "success" : "danger"}>
          {state.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Төрөл сонгох
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {/* <option value="">Төрөл сонгох...</option> */}
            {FODDER_TYPE.map((fodder) => (
              <option key={fodder.type} value={fodder.type}>
                {fodder.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="type">
            type
          </label>
          <input
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        {formData.type === "uvs" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тоо ширхэг
            </label>
            <input
              type="number"
              name="counts"
              value={formData.counts}
              placeholder="Өвсний боодлын тоо"
              onChange={handleChange}
              required
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {formData.type === "tejeel" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Жин (кг)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              placeholder="Тэжээлийн жин"
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="price">
            Үнэ
          </label>
          <input
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="buy_date">
            Худалдан авалтын хугацаа
          </label>
          <input
            type="date"
            id="buy_date"
            name="buy_date"
            value={formData.buy_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
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

          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/fodder/purchase")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            Буцах
          </Button>
        </div>
      </form>
    </div>
  );
}
