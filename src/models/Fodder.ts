import { User } from "next-auth";
import { FodderType } from "./enum";
import { FodderRecord } from "./FodderRecord";
import { FodderPurchase } from "./FodderPurchase";

export interface FodderStock {
    id: number;
    types: FodderType;
    owner_id: number;
    owner: User;
    records: FodderRecord[];
    purchase: FodderPurchase[];
  }