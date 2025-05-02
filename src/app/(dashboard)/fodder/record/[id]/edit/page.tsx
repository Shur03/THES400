"use client";
import { Button, Alert, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FodderType from "@/models/FodderType";
import PageProps from "@/components/props/pageprop";

const FODDER_TYPE = Object.entries(FodderType).map(([id, name]) => ({
  id: parseInt(id),
  name,
}));

export default function EditRecord({ params }: PageProps<{ id: string }>) {
  const [formData, setFormData] = useState({
    fodder_id: 0,
    type: "",
    quantity_used: "",
    used_date: "",
  });
  const [state, setState] = useState<{
    message: string;
    success: boolean;
    errors?: Record<string, string[]>;
  }>({ message: "", success: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`/api/fodders/record/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch record");
        }
        const data = await response.json();
        setFormData({
          fodder_id: data.fodder_id,
          type: data.type,
          quantity_used: data.quantity_used,
          used_date: data.used_date ? data.used_date.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error fetching record:", error);
        setState({
          message: "Алдаа гарлаа. Дахин оролдоно уу.",
          success: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
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
      const response = await fetch(`/api/fodders/record/${params.id}`, {
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
        router.push("/record");
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
  const handleReset = () => {
    setFormData({
      fodder_id: 0,
      type: "",
      quantity_used: "",
      used_date: "",
    });
    setMessage("");
    setSuccess(false);
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

      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="p-6 bg-white rounded-lg shadow-md text-gray-900"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Өвс, тэжээлийн зарцуулалт
        </h2>

        {message && (
          <Alert
            variant={success ? "success" : "danger"}
            className="mb-4"
            dismissible
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Төрөл сонгох
          </label>
          <select
            name="type"
            value={formData.fodder_id}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Төрөл сонгох...</option>
            {FODDER_TYPE.map((fodder) => (
              <option key={fodder.id} value={fodder.id}>
                {fodder.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="quantity_used">
            Хэрэглэсэн хэмжээ
          </label>
          <input
            type="number"
            id="quantity_used"
            name="quantity_used"
            value={formData.quantity_used}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="used_date">
            Хэрэглэсэн огноо
          </label>
          <input
            type="date"
            id="used_date"
            name="used_date"
            value={formData.used_date}
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
            type="reset"
            variant="secondary"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            Буцах
          </Button>
        </div>
      </form>
    </div>
  );
}
