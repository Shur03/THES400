
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
  }