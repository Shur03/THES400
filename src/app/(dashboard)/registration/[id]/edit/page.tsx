"use client";
import { Button, Alert, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { count } from "console";

const STOCK_TYPES = [
  { id: 1, name: "Хонь" },
  { id: 2, name: "Ямаа" },
  { id: 3, name: "Үхэр" },
  { id: 4, name: "Адуу" },
  { id: 5, name: "Тэмээ" },
];

export default function EditRegistration({
  params,
}: {
  params: { id: string };
}) {
  const [formData, setFormData] = useState({
    id: 0,
    stock_id: 0,
    event_type: "",
    counts: 0,
    descrip: "",
    event_date: "",
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
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch registration");
        }
        const data = await response.json();
        setFormData({
          id: data.id,
          stock_id: data.stock_id,
          event_type: data.event_type,
          counts: data.counts,
          descrip: data.descrip || "",
          event_date: data.event_date ? data.event_date.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error fetching registration:", error);
        setState({
          message: "Алдаа гарлаа. Дахин оролдоно уу.",
          success: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
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
      const response = await fetch(`/api/events/${params.id}`, {
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
        router.push("/registration");
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
          <label className="block text-gray-700 mb-2" htmlFor="event_type">
            Бүртгэлы нэр
          </label>
          <input
            type="text"
            id="event_type"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              state.errors?.event_type ? "border-red-500" : ""
            }`}
          />
          {state.errors?.event_type && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.event_type[0]}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="event_type">
            Тоо толгой
          </label>
          <input
            type="number"
            id="counts"
            name="counts"
            value={formData.counts}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              state.errors?.counts ? "border-red-500" : ""
            }`}
          />
          {state.errors?.counts && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.counts[0]}
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
          <label className="block text-gray-700 mb-2" htmlFor="event_date">
            Дараа хийх хугацаа
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date}
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
            onClick={() => router.push("/registration")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            Буцах
          </Button>
        </div>
      </form>
    </div>
  );
}
