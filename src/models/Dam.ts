import { DamType } from "./enum";
import { LiveStock } from "./LiveStock";
import { Sire } from "./Sire";

export interface Dam {
    id: number;
    stock_id: number;
    sire_id: number;
    dam_type: DamType;
    calving_date: Date;
    stock: LiveStock;
    sire: Sire;
  }