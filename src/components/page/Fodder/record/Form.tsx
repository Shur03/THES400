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
import create from "@/app/(dashboard)/fodder/create/action";

type Props = {
  fodderList: FodderStock[];
};
// Өвс тэжээлийн зарцуулалтыг бүртгэх
export default function Form({ fodderList }: Props) {
  const [formData, setFormData] = useState({
    fodder_id: "",
    quantity_used: "",
    used_date: "",
  });

  const [selectedFodder, setSelectedFodder] = useState<FodderStock | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "fodder_id") {
      const fodder = fodderList.find((f) => f.id.toString() === value);
      setSelectedFodder(fodder || null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await create(formData);

    if (response.success) {
      setMessage("Фоддер амжилттай хадгалагдлаа!");
      setSuccess(true);
    } else {
      setMessage("Алдаа гарлаа, дахин оролдоно уу.");
      setSuccess(false);
    }
  };

  return (
    <BSForm
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow-lg rounded-lg text-gray-700"
    >
      {message && (
        <Alert variant={success ? "success" : "danger"}>{message}</Alert>
      )}

      {/* Fodder Type Selection */}
      {/* Type Selection Dropdown */}
      <FormGroup className="mb-4">
        <FormLabel className="font-semibold">Төрөл сонгох</FormLabel>
        <FormControl
          as="select"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Сонгох...</option>
          <option value="uvs">Өвс</option>
          <option value="tej">Тэжээл</option>
        </FormControl>
      </FormGroup>

      <FormGroup className="mb-4">
        <FormLabel className="font-semibold">Тоо ширхэг</FormLabel>
        <FormControl
          className="mx-5"
          type="number"
          name="quantity_used"
          value={formData.quantity_used}
          placeholder="Хэрэглэсэн хэмжээ"
          onChange={handleChange}
          required
        />
      </FormGroup>

      {/* Weight */}

      {/* Purchase Date */}
      <FormGroup className="mb-4">
        <FormLabel className="font-semibold">Хэрэглэгсэн огноо</FormLabel>
        <FormControl
          type="date"
          name="buy_date"
          value={formData.used_date}
          placeholder="Хэрэглэгсэн авсан огноо"
          onChange={handleChange}
        />
      </FormGroup>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-md"
        >
          Хадгалах
        </Button>
        <Button
          type="reset"
          className="bg-gray-300 hover:bg-gray-400 text-black p-3 rounded-md"
        >
          Цэвэрлэх
        </Button>
      </div>
    </BSForm>
  );
}
