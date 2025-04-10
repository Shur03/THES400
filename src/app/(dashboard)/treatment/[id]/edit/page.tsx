"use client";
import { Button, Alert, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StockType from "@/models/StockType";

const STOCK_TYPES = Object.entries(StockType).map(([id, name]) => ({
  id: parseInt(id),
  name,
}));

export default function EditTreatment({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    id: 0,
    stock_id: 0,
    treatment_name: "",
    descrip: "",
    freq_date: "",
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
    const fetchTreatment = async () => {
      try {
        const response = await fetch(`/api/treatments/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch treatment");
        }
        const data = await response.json();
        setFormData({
          id: data.id,
          stock_id: data.stock_id,
          treatment_name: data.treatment_name,
          descrip: data.descrip || "",
          freq_date: data.freq_date ? data.freq_date.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error fetching treatment:", error);
        setState({
          message: "Алдаа гарлаа. Дахин оролдоно уу.",
          success: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
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
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/treatments/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setState({
          message: "Вакцин амжилттай шинэчлэгдлээ!",
          success: true,
        });
        router.push("/treatment");
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
      <h2 className="text-xl font-semibold mb-4">Эмчилгээ засварлах</h2>

      {state.message && (
        <Alert variant={state.success ? "success" : "danger"}>
          {state.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="stock_type">
            Малын төрөл
          </label>
          <select
            id="stock_type"
            name="stock_id"
            value={formData.stock_id}
            onChange={handleChange}
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
          {state.errors?.stock_id && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.stock_id[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="treatment_name">
            Вакцины нэр
          </label>
          <input
            type="text"
            id="treatment_name"
            name="treatment_name"
            value={formData.treatment_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              state.errors?.treatment_name ? "border-red-500" : ""
            }`}
          />
          {state.errors?.treatment_name && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.treatment_name[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="descrip">
            Тайлбар
          </label>
          <textarea
            id="descrip"
            name="descrip"
            value={formData.descrip}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="freq_date">
            Дараа хийх хугацаа
          </label>
          <input
            type="date"
            id="freq_date"
            name="freq_date"
            value={formData.freq_date}
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
            onClick={() => router.push("/treatment")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            Буцах
          </Button>
        </div>
      </form>
    </div>
  );
}
