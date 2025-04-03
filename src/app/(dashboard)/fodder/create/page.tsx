"use client";

import { useState, ChangeEvent } from "react";
import PurchaseForm from "@/components/page/Fodder/purchase/PurchaseForm";
import {
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";

export default function Page() {
  const [formType, setFormType] = useState<string>("purchase"); // Default to purchase form

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormType(event.target.value);
  };

  return (
    <div className="mx-5 bg-blue-300 rounded-lg p-4">
      <Card>
        <CardHeader className="text-gray-800">
          Өвс тэжээллийн мэдээлэл нэмэх
        </CardHeader>
        <CardBody>
          {/* Dropdown to select form type */}
          <FormGroup className="mb-3">
            <FormLabel>Мэдээллийн төрөл сонгох</FormLabel>
            <select
              className="form-control"
              value={formType}
              onChange={handleChange}
            >
              <option value="purchase">Худалдан авалт (Purchase)</option>
              <option value="records">Бүртгэл (Records)</option>
            </select>
          </FormGroup>

          {/* Conditionally render the selected form */}
          {formType === "purchase" ? (
            <PurchaseForm fodderList={[]} />
          ) : (
            // <RecordForm fodderList={[]} />
            <h1>Record</h1>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
