"use client";
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  NotepadText,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StockChart from "@/components/charts/StockChart";
import StockTypeMap from "@/models/StockTypeMap";

type LiveStock = {
  id: number;
  stock_type: string;
  counts: number;
  trend?: "up" | "down" | "neutral";
  change?: number;
};

export default function StockList() {
  const router = useRouter();
  const [liveStock, setLiveStock] = useState<LiveStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
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
      // Add mock trend data for demo
      const dataWithTrends = data.map((item: LiveStock) => ({
        ...item,
        trend: ["up", "down", "neutral"][Math.floor(Math.random() * 3)] as
          | "up"
          | "down"
          | "neutral",
        change: Math.floor(Math.random() * 20) + 1,
      }));
      setLiveStock(dataWithTrends);
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setError(
        err instanceof Error ? err.message : "Алдаа гарлаа. Дахин оролдоно уу."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-100">
        <div className="text-red-600 font-medium mb-3 text-center">{error}</div>
        <Button
          variant="outline-primary"
          onClick={fetchData}
          className="flex items-center gap-2"
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <RefreshCw className="animate-spin h-4 w-4" />
              Түр хүлээнэ үү...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Дахин оролдох
            </>
          )}
        </Button>
      </div>
    );
  }

  if (liveStock.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-200 shadow-sm bg-white rounded-lg">
        <NotepadText size={48} className="text-gray-400 mb-4 mx-auto" />
        <h5 className="text-lg text-gray-800 font-semibold mb-2">
          Одоогоор бүртгэл үүсээгүй байна
        </h5>
        <p className="text-gray-600 mb-4">
          Шинэ бүртгэл нэмэх бол доорх товчыг дарна уу
        </p>
        <Button
          variant="primary"
          onClick={() => router.push("/stock/add")}
          className="flex items-center gap-2 mx-auto"
        >
          <PlusCircle size={18} />
          Шинэ бүртгэл нэмэх
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {liveStock.map((stock, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-gray-700 text-sm font-medium">
                {StockTypeMap[stock.stock_type] ?? stock.stock_type}
              </h4>
              {stock.trend && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    stock.trend === "up"
                      ? "bg-green-100 text-green-800"
                      : stock.trend === "down"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {stock.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : stock.trend === "down" ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : null}
                  {stock.change}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-3">
              {stock.counts}
            </p>
            <div className="h-12">
              <StockChart trend={stock.trend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
