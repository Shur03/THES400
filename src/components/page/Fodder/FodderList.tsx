"use client";

import { TreeDeciduous } from "lucide-react";
import { useEffect, useState } from "react";

type Fodder = {
  id: number;
  type: string;
  quantity: number;
};

// type FodderRecord = {
//   id: number;
//   quantity_used: number;
//   used_date: string;
//   fodder: Fodder;
// };

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
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="overflow-x-auto grid grid-cols-2 gap-4">
          {records.map((record) => (
            <div className="bg-white w-full  rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {record.type}
                  </p>
                  <p className="text-3xl font-semibold text-gray-800">
                    {record.quantity}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <TreeDeciduous className=" text-green-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
