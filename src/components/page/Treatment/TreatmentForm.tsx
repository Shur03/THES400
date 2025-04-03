import { create } from "@/app/(dashboard)/treatment/create/action";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Alert, Spinner } from "react-bootstrap";

export default function TreatmentForm() {
  const [formData, setFormData] = useState({
    stock_id: 0,
    treatment_name: "",
    counts: 0,
    descrip: "",
    freq_date: "",
  });
  const [state, setState] = useState<{
    message: string;
    success: boolean;
    errors?: Record<string, string[]>;
  }>({ message: "", success: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: session } = useSession();
  // type LivestockType = {
  //   id: number;
  //   stock_type: string;
  // };
  const ANIMAL_TYPES = [
    { id: 1, name: "Хонь" },
    { id: 2, name: "Ямаа" },
    { id: 3, name: "Үхэр" },
    { id: 4, name: "Адуу" },
    { id: 5, name: "Тэмээ" },
  ];
  // const [livestockTypes, setLivestockTypes] = useState<LivestockType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "stock_id" || name === "counts" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await create(formData);

    if (result.success) {
      setMessage("Вакцин амжилттай хадгалагдлаа!");
      setSuccess(true);
      setFormData({
        stock_id: 0,
        treatment_name: "",
        counts: 0,
        descrip: "",
        freq_date: "",
      });
    } else {
      setMessage(result.error || "Алдаа гарлаа, дахин оролдоно уу.");
      setSuccess(false);
    }

    setIsSubmitting(false);
  };
  //Нэвтэрч орсон хэрэглэгчийн мал сүрэг
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user-livestock")
        .then((res) => res.json())
        .then((data) => {
          // setLivestockTypes(data);
          setLoadingTypes(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoadingTypes(false);
        });
    }
  }, [session]);
  return (
    <div className="max-w-md mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Эмчилгээний бүртгэл</h2>

      {state.message && (
        <Alert variant={state.success ? "success" : "danger"}>
          {state.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="stock_id">
            Малын төрөл
          </label>
          {loadingTypes ? (
            <Spinner size="sm" />
          ) : (
            <select
              id="stock_id"
              name="stock_id"
              value={formData.stock_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                state.errors?.stock_id ? "border-red-500" : ""
              }`}
              required
            >
              <option value="">-- Сонгох --</option>
              {livestockTypes.map((livestock) => (
                <option key={livestock.id} value={livestock.id}>
                  {livestock.stock_type}
                </option>
              ))}
            </select>
          )}
          {state.errors?.stock_id && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.stock_id[0]}
            </p>
          )}
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="animal_type">
            Малын төрөл
          </label>
          <div className="flex gap-2">
            <select
              id="animal_type"
              name="animal_type"
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
              {ANIMAL_TYPES.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
            {/* <input
              type="number"
              id="stock_id"
              name="stock_id"
              value={formData.stock_id}
              onChange={handleChange}
              className={`flex-1 px-3 py-2 border rounded-md ${
                state.errors?.stock_id ? "border-red-500" : ""
              }`}
              min="1"
              max="5"
              placeholder="ID оруулах"
            /> */}
          </div>
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
          <label className="block text-gray-700 mb-2" htmlFor="counts">
            Хийгдсэн малын тоо
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
            min="1"
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
            onClick={() => {
              setFormData({
                stock_id: 0,
                treatment_name: "",
                counts: 0,
                descrip: "",
                freq_date: "",
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
