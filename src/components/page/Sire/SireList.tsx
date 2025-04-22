import { Table, Button, Spinner, Card, Badge } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { NotepadText } from "lucide-react";
import { useRouter } from "next/navigation";
import StockTypeMap from "@/models/StockTypeMap";
import { DeleteButton } from "@/components/shared/buttons/deleteButton";
import { EditButton } from "@/components/shared/buttons/editButton";
import { SireRecord } from "@/models/SireRecord";

export default function SireList() {
  const [sireRecords, setSireRecords] = useState<SireRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/sires");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        setSireRecords(data);
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

  if (sireRecords.length === 0) {
    return (
      <Card className="text-center py-8 border-0 shadow-sm">
        <Card.Body className="flex flex-col items-center">
          <NotepadText size={48} className="text-gray-800 mb-4" />
          <h5 className="text-lg font-semibold mb-2 text-gray-700">
            Одоогоор бүртгэл үүсээгүй байна. Нэмнэ үү.
          </h5>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Бүртгэл</h2>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  №
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ангилал
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Зүс
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үүлдэр
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Жин
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sireRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.stock?.stock_type && (
                      <Badge
                        bg="info"
                        className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                      >
                        {StockTypeMap[record.stock.stock_type] ??
                          record.stock.stock_type}
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {record.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {record.breed || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {record.weight || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-3">
                      <EditButton id={record.id} path="sire" />
                      <DeleteButton
                        id={record.id}
                        endpoint="sires"
                        itemName="энэ бүртгэл"
                      />
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
