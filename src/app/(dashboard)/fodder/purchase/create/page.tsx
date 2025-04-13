"use client";

import { useState, ChangeEvent } from "react";
import PurchaseForm from "@/components/page/Fodder/purchase/PurchaseForm";

export default function Page() {
  const [formType, setFormType] = useState<string>("purchase"); // Default to purchase form
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormType(event.target.value);
  };

  return <PurchaseForm fodderList={[]} />;
}
