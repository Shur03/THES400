"use client";

import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { FodderStock } from "@/models/Fodder";
import { create } from "@/app/(dashboard)/fodder/purchase/create/action";
import { useRouter } from "next/navigation";

type Props = {
  fodderList: FodderStock[];
};

export default function PurchaseForm({ fodderList }: Props) {
  const [formData, setFormData] = useState({
    type: "",
    weight: "",
    counts: "",
    buy_date: "",
    price: "",
  });

  const [selectedFodder, setSelectedFodder] = useState<FodderStock | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target as
      | HTMLInputElement
      | HTMLSelectElement;
    setFormData({ ...formData, [name]: value });

    if (name === "fodder_id") {
      const fodder = fodderList.find((f) => f.id.toString() === value);
      setSelectedFodder(fodder || null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });

      const response = await create({
        // fodder_id: parseInt(formData.fodder_id, 10),
        type: formData.type,
        weight: parseFloat(formData.weight),
        counts: parseInt(formData.counts, 10),
        buy_date: new Date(formData.buy_date),
      });

      if (response.success) {
        setMessage(" Амжилттай хадгалагдлаа!");
        setSuccess(true);
        setFormData({
          // fodder_id: "",
          type: "",
          weight: "",
          counts: "",
          buy_date: "",
          price: "",
        });
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
      weight: "",
      counts: "",
      buy_date: "",
      price: "",
    });
    setMessage("");
    setSuccess(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="p-6 bg-white rounded-lg shadow-md text-gray-900"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Өвс, тэжээлийн худалдан авалт
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
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Төрөл сонгох...</option>
          <option value="uvs">Өвс</option>
          <option value="tej">Тэжээл</option>
        </select>
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

      {formData.type === "tej" && (
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Худалдан авсан огноо
        </label>
        <input
          type="date"
          name="buy_date"
          value={formData.buy_date}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Нийт үнэ
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          placeholder="Худалдан авсан үнэ"
          onChange={handleChange}
          required
          min="0"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  );
}
