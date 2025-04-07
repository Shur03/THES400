// hooks/useMedicalRecords.ts
import { useEffect, useState } from "react";

export type MedicalRecord = {
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

export function useMedicalRecords() {
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
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Server returned ${response.status}: ${response.statusText}`
          );
          console.log('eee');
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

  return { medicalRecords, loading, error };
}
