"use client";

import { useRegister } from "@/app/hooks/useRegister";
import { useState } from "react";

export default function RegisterPage() {
  const { register, loading, error } = useRegister();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await register(name, password, phone);
      alert("Registration successful!");
      console.log(user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-blue-200  rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Бүртгүүлэх</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Нэрээ оруулна уу"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Утасны дугаараа оруулна уу"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Нууц үгээ оруулна уу"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
