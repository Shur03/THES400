"use client";

import FodderTypeMap from "@/models/FodderTypeMap";
import { Package, Sprout, TreeDeciduous } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Spinner } from "react-bootstrap"; // Optional: or replace with your own loader

type Fodder = {
  id: number;
  types: string;
  quantity: number;
};

export default function FodderList() {
  const [records, setRecords] = useState<Fodder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/fodders");
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error("Failed to load fodder records:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner animation="border" variant="success" />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          <p className="text-lg font-medium">Бүртгэл олдсонгүй</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    <Badge
                      bg="info"
                      className={`text-xs px-2 py-1 rounded-full ${
                        record.types === "uvs"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {FodderTypeMap[record.types] ?? record.types}
                    </Badge>
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {record.quantity}
                  </p>
                  ` `
                </div>
                <div className="bg-green-50 p-3 rounded-full self-end">
                  $
                  {record.types === "uvs" ? (
                    <Sprout className="text-green-500 h-4 w-4" />
                  ) : (
                    <Package className="text-green-500 h-4 w-4" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
