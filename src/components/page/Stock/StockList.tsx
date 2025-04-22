"use client";
import { Button, Spinner, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { NotepadText } from "lucide-react";
import { useRouter } from "next/navigation";
import StockChart from "@/components/charts/StockChart";
import StockTypeMap from "@/models/StockTypeMap";

type LiveStock = {
  id: number;
  stock_type: string;
  counts: number;
};

export default function StockList() {
  const router = useRouter();
  const [liveStock, setliveStock] = useState<LiveStock[]>([]);
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
        setliveStock(data);
      } catch (err) {
        console.error("Error fetching medical records:", err);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-gray-600">Түр хүлээнэ үү...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg">
        <div className="text-red-600 font-medium mb-3">{error}</div>
        <Button
          variant="outline-primary"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          Дахин оролдох
        </Button>
      </div>
    );
  }

  if (liveStock.length === 0) {
    return (
      <Card className="text-center py-8 border-0 shadow-sm">
        <Card.Body className="flex flex-col items-center">
          <NotepadText size={48} className="text-gray-400 mb-4" />
          <h5 className="text-lg text-gray-800 font-semibold mb-2">
            Одоогоор бүртгэл үүсээгүй байна. Нэмнэ үү.
          </h5>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 p-4 px-0">
      {liveStock.map((stock, index) => (
        <div
          key={index}
          className="bg-[#C1EEFF] rounded-xl p-4 shadow-md flex items-center justify-between"
        >
          <div>
            <h4 className="text-gray-700 text-lg font-semibold">
              {StockTypeMap[stock.stock_type] ?? stock.stock_type}
            </h4>
            <p className="text-2xl font-bold text-gray-800">{stock.counts}</p>
          </div>
          <div className="w-12 h-8 ">
            <StockChart />
          </div>
        </div>
      ))}
    </div>
  );
}
