import { Table, Button, Spinner, Card, Badge } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { NotepadText, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import StockTypeMap from "@/models/StockTypeMap";
import EventTypeMap from "@/models/EventTypeMap";
import { DeleteButton } from "@/components/shared/buttons/deleteButton";
import { EditButton } from "@/components/shared/buttons/editButton";

type EventRecord = {
  id: number;
  stock_id: number;
  event_type: string;
  counts: number;
  descrip: string | null;
  event_date: string | null;
  stock?: {
    id: number;
    stock_type?: string;
  };
};

export default function EventList() {
  const router = useRouter();
  const [eventRecords, seteventRecords] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/events");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        seteventRecords(data);
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

  if (eventRecords.length === 0) {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  №
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Малын төрөл
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төрөл
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тоо толгой
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тайлбар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Огноо
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {EventTypeMap[record.event_type] ?? record.event_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {record.counts}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {record.descrip || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {record.event_date ? (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CalendarDays size={16} className="text-gray-400" />
                        {new Date(record.event_date).toLocaleDateString()}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex gap-2 justify-end">
                      <EditButton id={record.id} path="registration" />
                      <DeleteButton
                        id={record.id}
                        endpoint="events"
                        itemName="энэ бүртгэл"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {eventRecords.map((record, index) => (
            <div
              key={record.id}
              className="border rounded-lg p-4 shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  {StockTypeMap[record.stock?.stock_type || ""] ??
                    record.stock?.stock_type}
                </h3>
                <span className="text-xs text-gray-500">{`#${index + 1}`}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Төрөл:</strong>{" "}
                {EventTypeMap[record.event_type] ?? record.event_type}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Тоо толгой:</strong> {record.counts}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Тайлбар:</strong> {record.descrip || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Огноо:</strong>{" "}
                {record.event_date
                  ? new Date(record.event_date).toLocaleDateString()
                  : "-"}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => router.push(`/registration/${record.id}/edit`)}
                  className="flex-1"
                >
                  Засах
                </Button>
                <DeleteButton
                  id={record.id}
                  endpoint="events"
                  itemName="энэ бүртгэл"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
