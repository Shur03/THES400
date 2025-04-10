"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Form as BSForm,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { FodderStock } from "@/models/Fodder";
import { create } from "@/app/(dashboard)/fodder/create/action";

type Props = {
  fodderList: FodderStock[];
};

export default function PurchaseForm({ fodderList }: Props) {
  const [formData, setFormData] = useState({
    fodder_id: "",
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
        fodder_id: parseInt(formData.fodder_id, 10),
        type: formData.type,
        weight: parseFloat(formData.weight),
        counts: parseInt(formData.counts, 10),
        buy_date: new Date(formData.buy_date),
      });

      if (response.success) {
        setMessage(" Амжилттай хадгалагдлаа!");
        setSuccess(true);
        setFormData({
          fodder_id: "",
          type: "",
          weight: "",
          counts: "",
          buy_date: "",
          price: "",
        });
      } else {
        setMessage(response.message || "Алдаа гарлаа, дахин оролдоно уу.");
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
      fodder_id: "",
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
    <BSForm
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="p-6 bg-white rounded-lg shadow-md"
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
      <FormGroup className="mb-4">
        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
          Төрөл сонгох
        </FormLabel>
        <FormControl
          as="select"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Төрөл сонгох...</option>
          <option value="uvs">Өвс</option>
          <option value="tej">Тэжээл</option>
        </FormControl>
      </FormGroup>
      {formData.type === "uvs" && (
        <FormGroup className="mb-4">
          <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
            Тоо ширхэг
          </FormLabel>
          <FormControl
            type="number"
            name="counts"
            value={formData.counts}
            placeholder="Өвсний боодлын тоо"
            onChange={handleChange}
            required
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </FormGroup>
      )}

      {formData.type === "tej" && (
        <FormGroup className="mb-4">
          <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
            Жин (кг)
          </FormLabel>
          <FormControl
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
        </FormGroup>
      )}
      <FormGroup className="mb-4">
        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
          Худалдан авсан огноо
        </FormLabel>
        <FormControl
          type="date"
          name="buy_date"
          value={formData.buy_date}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </FormGroup>
      <FormGroup className="mb-4">
        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
          Нийт үнэ
        </FormLabel>
        <FormControl
          type="number"
          name="price"
          value={formData.price}
          placeholder="Худалдан авсан үнэ"
          onChange={handleChange}
          required
          min="0"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </FormGroup>
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
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
        >
          Цэвэрлэх
        </Button>
      </div>
    </BSForm>
  );
}
