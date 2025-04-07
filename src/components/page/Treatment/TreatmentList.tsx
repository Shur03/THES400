// components/TreatmentList.tsx
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
  Button,
  Badge,
  Spinner,
  Card,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  CalendarDays,
  NotepadText,
  Ellipsis,
  Trash2,
  Pencil,
} from "lucide-react";

type MedicalRecord = {
  id: number;
  stock_id: number;
  treatment_name: string;
  counts: number;
  descrip: string | null;
  freq_date: string | null;
  stock?: {
    id: number;
    stock_type?: string;
  };
};
export default function TreatmentList() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/treatments");

        if (!response.ok) {
          // Try to get the error message from the response
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        setMedicalRecords(data);
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
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-sm text-gray-800">Түр хүлээнэ үү...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        {error}
        <Button variant="link" onClick={() => window.location.reload()}>
          Дахин оролдох
        </Button>
      </div>
    );
  }

  if (medicalRecords.length === 0) {
    return (
      <Card className="text-center py-4">
        <Card.Body>
          {/* <FaNotesMedical size={48} className="text-muted mb-3" /> */}
          <NotepadText />
          <h5>Бүртгэл байхгүй байна</h5>
          <p className="text-muted">Шинэ эмчилгээний бүртгэл нэмэх</p>
          <Link href="/treatment/new" passHref>
            <Button variant="primary">
              {/* <FaPlus className="me-2" /> */}
              <Plus />
              Нэмэх
            </Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      <div className="table-responsive text-gray-900 ">
        <Table striped bordered hover className="align-middle">
          <thead className="table-light">
            <tr
              className="
            rounded-lg"
            >
              <th style={{ width: "5%" }}>№</th>
              <th style={{ width: "15%" }}>Вакцинжуулагдсан мал</th>
              <th style={{ width: "20%" }}>Эмчилгээ/Вакцин</th>
              <th style={{ width: "10%" }}>Тоо ширхэг</th>
              <th style={{ width: "20%" }}>Тайлбар</th>
              <th style={{ width: "15%" }}>Дараагийн огноо</th>
              <th style={{ width: "15%" }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="mx-5 rounded-lg ">
            {medicalRecords.map((record, index) => (
              <tr
                key={record.id}
                className={index % 2 === 0 ? "bg-blue-200 " : "bg-white  "}
              >
                <td className="fw-bold">{index + 1}</td>
                <td>
                  {/* <Badge bg="info">{record.stock_id}</Badge> */}
                  {record.stock?.stock_type && (
                    <span className="ms-2">{record.stock.stock_type}</span>
                  )}
                </td>
                <td className="fw-semibold ">{record.treatment_name}</td>
                <td>
                  <Badge bg="secondary">{record.counts}</Badge>
                </td>
                <td>
                  <small className="text-muted">{record.descrip || "-"}</small>
                </td>
                <td>
                  {record.freq_date ? (
                    <div className="d-flex align-items-center">
                      {new Date(record.freq_date).toLocaleDateString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as={Button}
                      variant="link"
                      className="text-dark p-0"
                      id={`action-${record.id}`}
                    >
                      <div className="flex flex-row space-x-5">
                        <Pencil className="text-blue-400 " />
                        <Trash2 className="text-red-500" />
                      </div>
                    </DropdownToggle>
                    {/* <DropdownMenu>
                      <DropdownItem href={`/treatment/${record.id}`}>
                        Дэлгэрэнгүй
                      </DropdownItem>
                      <Link href={`/treatment/${record.id}/edit`} passHref>
                        <DropdownItem>Засах</DropdownItem>
                      </Link>
                      <DropdownItem className="text-danger">
                        Устгах
                      </DropdownItem>
                    </DropdownMenu> */}
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
//
