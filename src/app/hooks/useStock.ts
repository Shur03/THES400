import { useEffect, useState } from "react";

export type Stock = {
  id: number;
    stock_type: string;
    counts : number;
};

export function useStock() {
  const [liveStock, setliveStockRecords] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/stock");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        setliveStockRecords(data);
      } catch (err) {
        console.error("Бүртгэлийг хадгалахад алдаа гарлаа.:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Алдаа гарлаа. Дахин оролдоно уу."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { liveStock, loading, error };
}
