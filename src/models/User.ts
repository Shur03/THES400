import { FodderStock } from "./Fodder";

export interface User {
    id: number;
    name: string;
    password: string;
    phone: string;
    fodders: FodderStock[];
    livestock: LiveStock[];
  }