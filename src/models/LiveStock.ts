import { User } from "next-auth";
import { Sex, StockType } from "./enum";
import { EventRecord } from "./EventRecord";
import { MedicalRecord } from "./MedicalRecord";
import { Sire } from "./Sire";
import { Dam } from "./Dam";

export interface LiveStock {
    id: number;
    owner_id: number;
    stock_type: StockType;
    age?: number;
    color?: string;
    gender?: Sex;
    counts: number;
    owner: User;
    events?: EventRecord;
    medicals?: MedicalRecord;
    sire?: Sire;
    dam?: Dam;
  }