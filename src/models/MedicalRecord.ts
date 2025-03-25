import { LiveStock } from "./LiveStock";

export interface MedicalRecord {
    id: number;
    stock_id: number;
    treatment_name: string;
    counts: number;
    descrip?: string;
    freq_date?: Date;
    stock: LiveStock;
  }