// filepath: c:\Users\HP\bsa\LiveStock\bsa-live\src\hooks\useRegister.ts
import { useState } from "react";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (name: string, password: string, phone: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password, phone }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register");
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}