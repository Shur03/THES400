"use client";

import { useRegister } from "@/app/hooks/useRegister";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "react-bootstrap";

export default function RegisterPage() {
  const { register, loading, error } = useRegister();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    phone: "",
  });
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await register(formData.name, formData.password, formData.phone);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="items-center justify-center flex flex-col md:flex-row ">
      <div className="min-h-screen  flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full  max-w-4xl">
          <Card className="rounded-xl overflow-hidden shadow-lg border-0">
            <div className="bg-blue-600 p-6 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Бүртгүүлэх
              </h1>
              <p className="mt-1 text-blue-100">
                Шинэ хэрэглэгч бол бүртгүүлнэ үү
              </p>
            </div>

            <CardBody className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="hidden md:flex md:w-full bg-blue-50 items-center justify-center p-8">
                  <div className="text-center">
                    <svg
                      className="w-32 h-32 mx-auto text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                      />
                    </svg>
                    <h3 className="mt-4 text-xl font-semibold text-blue-800">
                      Системд нэвтрэх эрхээ аваарай
                    </h3>
                    <p className="mt-2 text-blue-600">
                      Бүртгэлтэй хэрэглэгчид системийн бүх үйлчилгээг авах
                      боломжтой
                    </p>
                  </div>
                </div>

                {/* Right side - form */}
                <div className="w-full  p-6 sm:p-8">
                  {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                      ✅ Амжилттай бүртгэгдлээ! Нэвтрэх хуудас руу шилжиж
                      байна...
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      ⚠️ {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Нэр
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Нэрээ оруулна уу"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Утасны дугаар
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Утасны дугаараа оруулна уу"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Нууц үг
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Хамгийн багадаа 6 тэмдэгт"
                        minLength={6}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                        loading
                          ? "bg-blue-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Бүртгэж байна...
                        </span>
                      ) : (
                        "Бүртгүүлэх"
                      )}
                    </button>
                  </form>
                  <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                      Бүртгэлтэй юу?{" "}
                      <button
                        onClick={() => router.push("/login")}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                      >
                        Нэвтрэх
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
