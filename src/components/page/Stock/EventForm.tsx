import { create } from "@/app/(dashboard)/registration/create/action";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Alert } from "react-bootstrap";

export default function EventForm() {
  const [formData, setFormData] = useState({
    stock_id: 0,
    type: "",
    count: 0,
    descrip: "",
    event_date: "",
  });
  const [state, setState] = useState<{
    message: string;
    success: boolean;
    errors?: Record<string, string[]>;
  }>({ message: "", success: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  const STOCK_TYPES = [
    { id: 1, name: "Хонь" },
    { id: 2, name: "Ямаа" },
    { id: 3, name: "Адуу" },
    { id: 4, name: "Үхэр" },
    { id: 5, name: "Тэмээ" },
  ];
  const EVENT_TYPES = [
    { type: "inc", name: "Нэмэгдсэн" },
    { type: "dec", name: "Хорогдсон" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    const newValue = name === "stock_id" ? parseInt(value) || 0 : value;

    if (name === "count") {
      const parsed = parseInt(value);
      const countValue = isNaN(parsed) ? 0 : parsed;

      setFormData((prev) => ({
        ...prev,
        count: countValue,
      }));

      // Clear error if corrected
      if (countValue >= 0 && state.errors?.count) {
        setState((prev) => ({
          ...prev,
          errors: { ...prev.errors, count: [] },
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Clear previous messages
    setState({ message: "", success: false, errors: undefined });

    // Client-side validation
    if (formData.count <= 0) {
      setState({
        message: "Тоо толгой 0-ээс их байх ёстой!",
        success: false,
        errors: {
          count: ["Тоо толгой 0-ээс их байх ёстой."],
        },
      });
      return;
    }

    if (formData.stock_id <= 0) {
      setState({
        message: "Малын төрөл сонгоно уу!",
        success: false,
        errors: {
          stock_id: ["Малын төрөл сонгоно уу"],
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
          message: "Өсөлт хорогдлын бүртгэл амжилттай хадгалагдлаа!",
          success: true,
        });
        setFormData({
          stock_id: 0,
          type: "",
          count: 0,
          descrip: "",
          event_date: "",
        });
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Өсөлт хорогдлын бүртгэл</h2>

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
        {/* Rest of your form fields remain the same */}
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
          <label className="block text-gray-700 mb-2" htmlFor="type">
            Төрөл
          </label>
          <div className="flex gap-2">
            <select
              id="even_type"
              name="even_type"
              value={formData.type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  type: e.target.value,
                });
              }}
              className={`flex-1 px-3 py-2 border rounded-md ${
                state.errors?.stock_id ? "border-red-500" : ""
              }`}
            >
              <option value="0">-- Сонгох --</option>
              {EVENT_TYPES.map((event) => (
                <option key={event.type} value={event.type}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
          {state.errors?.type && (
            <p className="text-red-500 text-sm mt-1">{state.errors.type[0]}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="count">
            Тоо толгой
          </label>
          <input
            type="number"
            id="count"
            name="count"
            value={formData.count}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              state.errors?.count ? "border-red-500" : ""
            }`}
            min="0"
          />

          {state.errors?.count && (
            <p className="text-red-500 text-sm mt-1">{state.errors.count[0]}</p>
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
            Он сар өдөр
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
            className="px-4 py-2 bg-green-400 hover:bg-green-200 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Хадгалаж байна..." : "Хадгалах"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFormData({
                stock_id: 0,
                type: "",
                count: 0,
                descrip: "",
                event_date: "",
              });
              setState({ message: "", success: false });
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            Цэвэрлэх
          </Button>
        </div>
      </form>
    </div>
  );
}
