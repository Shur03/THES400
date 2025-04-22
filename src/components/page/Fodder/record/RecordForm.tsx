"use client";

import { create } from "@/app/(dashboard)/fodder/record/create/action";
import BackButton from "@/components/shared/buttons/backButton";
import FodderTypeMap, { FodderTypeMapType } from "@/models/FodderTypeMap";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
export default function RecordForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "",
    quantity_used: "",
    used_date: "",
  });

  const [selectedFodder, setSelectedFodder] =
    useState<FodderTypeMapType | null>(null);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<{
    message: string;
    success: boolean;
    errors?: Record<string, string[]>;
  }>({ message: "", success: false });
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target as
      | HTMLInputElement
      | HTMLSelectElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value.toString());
      });

      const response = await create({
        type: formData.type,
        quantity_used: parseInt(formData.quantity_used),
        used_date: new Date(formData.used_date),
      });

      if (response.success) {
        setMessage(" Амжилттай хадгалагдлаа!");
        setSuccess(true);
        setFormData({
          type: "",
          quantity_used: "",
          used_date: "",
        });
        router.back();
      } else {
        setMessage(response.error || "Алдаа гарлаа, дахин оролдоно уу.");
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Системийн алдаа гарлаа. Дахин оролдоно уу.");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReset = () => {
    setFormData({
      type: "",
      quantity_used: "",
      used_date: "",
    });
    setMessage("");
    setSuccess(false);
  };
  return (
    <div className="max-w-md mx-auto p-6 mt-3 md:mt-5 bg-white text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Өвс, тэжээлийн зарцуулалт
      </h2>

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
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="p-6 bg-white rounded-lg shadow-md text-gray-900"
      >
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
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Төрөл сонгох...</option>
            <option value="uvs">Өвс</option>
            <option value="tejeel">Тэжээл</option>
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

          <BackButton />
        </div>
      </form>
    </div>
  );
}
