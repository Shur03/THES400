import { FodderStock } from "./Fodder";

export interface FodderRecord {
    id: number;
    fodder_id: number;
    quantity_used: number;
    used_date: Date;
    fodder: FodderStock;
  }