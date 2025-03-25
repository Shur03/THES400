import { EventType } from "./enum";
import { LiveStock } from "./LiveStock";

export interface EventRecord {
    id: number;
    stock_id: number;
    event_type: EventType;
    counts: number;
    descrip?: string;
    event_date?: Date;
    stock: LiveStock;
  }