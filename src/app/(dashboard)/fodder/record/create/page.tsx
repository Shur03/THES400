"use client";

import { useState, ChangeEvent } from "react";
import PurchaseForm from "@/components/page/Fodder/purchase/PurchaseForm";
import { Card, CardBody, CardHeader, FormLabel } from "react-bootstrap";
import RecordForm from "@/components/page/Fodder/record/RecordForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const [formType, setFormType] = useState<string>("purchase"); // Default to purchase form
  const router = useRouter();
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormType(event.target.value);
  };

  return <RecordForm fodderList={[]} />;
}
