import { Table, Button, Spinner, Card, Badge } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Plus, NotepadText, Trash2, Pencil, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import FodderTypeMap from "@/models/FodderTypeMap";

type Records = {
  id: 0;
  type: "";
  quantity_used: 0;
  used_date: "";
};

export default function RecordList() {
  const router = useRouter();
  const [records, setRecords] = useState<Records[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/fodders/record");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        setRecords(data);
      } catch (err) {
        console.error("Бүртгэлийг харуулахад алдаа гарлаа:", err);
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

  if (records.length === 0) {
    return (
      <Card className="text-center py-8 border-0 shadow-sm">
        <Card.Body className="flex flex-col items-center">
          <NotepadText size={48} className="text-gray-800 mb-4" />
          <h5 className="text-lg font-semibold mb-2 text-gray-700">
            Бүртгэл байхгүй байна
          </h5>
        </Card.Body>
      </Card>
    );
  }
  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Зарцуулалтын бүртгэл
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  №
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төрөл
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Хэмжээ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Авсан огноо
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, index) => (
                <tr
                  key={record.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.type && (
                      <Badge
                        bg="info"
                        className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                      >
                        {FodderTypeMap[record.type] ?? record.type}
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {record.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {record.quantity_used || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.used_date ? (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CalendarDays size={16} className="text-gray-400" />
                        {new Date(record.used_date).toLocaleDateString()}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          router.push(`/fodders/record/${record.id}/edit`)
                        }
                        className="p-1.5 rounded-full hover:bg-blue-50"
                      >
                        <Pencil size={16} className="text-blue-600" />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

async function handleDelete(id: number) {
  if (confirm("Та энэ эмчилгээг устгахдаа итгэлтэй байна уу?")) {
    try {
      const response = await fetch(`/api/fodder/record/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error("Устгах явцад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Устгах явцад алдаа гарлаа. Дахин оролдоно уу.");
    }
  }
}
