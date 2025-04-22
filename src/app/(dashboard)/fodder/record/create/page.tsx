"use client";

import { useState, ChangeEvent } from "react";
import PurchaseForm from "@/components/page/Fodder/purchase/PurchaseForm";
import { Card, CardBody, CardHeader, FormLabel } from "react-bootstrap";
import RecordForm from "@/components/page/Fodder/record/RecordForm";
import { useRouter } from "next/navigation";

export default function Page() {
  return <RecordForm />;
}
