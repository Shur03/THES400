import { Dam } from "./Dam";
import { LiveStock } from "./LiveStock";

export interface Sire {
    id: number;
    stock_id: number;
    breed: string;
    weight?: number;
    dam: Dam[];
    stock: LiveStock;
  }
  