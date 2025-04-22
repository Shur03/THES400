export type SireRecord = {
  id: number;
  stock_id: number;
  name: string;
  breed: string;
  weight: number;
  stock?: {
    id: number;
    stock_type?: string;
  };
};