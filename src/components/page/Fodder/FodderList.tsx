"use client";

import FodderTypeMap from "@/models/FodderTypeMap";
import { Package, Sprout, Leaf, Wheat } from "lucide-react";
import { useEffect, useState } from "react";

type Fodder = {
  id: number;
  types: string;
  quantity: number;
};

export default function FodderList() {
  const [records, setRecords] = useState<Fodder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/fodders");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error("Failed to load fodder records:", err);
        setError("Өгөгдөл ачааллахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getFodderIcon = (type: string) => {
    switch (type) {
      case "uvs":
        return <Sprout className="h-5 w-5" />;
      case "tejeel":
        return <Package className="h-5 w-5" />;
      default:
        return <Leaf className="h-5 w-5" />;
    }
  };

  const getFodderColor = (type: string) => {
    return type === "uvs" ? "green" : "blue";
  };

  return (
    <div className="p-4 md:p-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-500">Тэжээлийн мэдээлэл ачаалж байна...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Дахин оролдох
          </button>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Package className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-500">
            Бүртгэл олдсонгүй
          </h3>
          <p className="text-gray-400 mt-1">
            Тэжээлийн мэдээлэл бүртгэгдээгүй байна
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {records.map((record) => {
            const color = getFodderColor(record.types);
            return (
              <div
                key={record.id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group hover:-translate-y-1`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
                      >
                        {getFodderIcon(record.types)}
                        <span className="ml-1">
                          {FodderTypeMap[record.types] ?? record.types}
                        </span>
                      </span>
                      <p className="text-3xl font-bold text-gray-800 mt-3">
                        {record.quantity.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          кг
                        </span>
                      </p>
                    </div>
                    <div className={`bg-${color}-50 p-2 rounded-lg`}>
                      {getFodderIcon(record.types)}
                    </div>
                  </div>
                </div>
                <div
                  className={`bg-${color}-50 px-5 py-3 border-t border-${color}-100`}
                >
                  <p className="text-xs text-gray-500 flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full bg-${color}-500 mr-2`}
                    ></span>
                    Нийт тэжээлийн үлдэгдэл
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
