import { FodderStock } from "./Fodder";

export interface FodderPurchase {
    id: number;
    fodder_id: number;
    weight?: number;
    counts?: number;
    buy_date: Date;
    fodder: FodderStock;
  }