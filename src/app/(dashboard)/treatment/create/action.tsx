"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function create(formData: {
  stock_id: number;
  treatment_name: string;
  descrip: string;
  freq_date: string;
}) {
  try {
    const treatment = prisma.medicalRecord.create({
      data: {
        stock_id: formData.stock_id,
        treatment_name: formData.treatment_name,
        descrip: formData.descrip,
        freq_date: formData.freq_date ? new Date(formData.freq_date) : null,
      },
    });

    return { success: true, treatment };
  } catch (error) {
    console.error("Error creating treatment:", error);
    return { success: false, error: "Failed to create treatment" };
  } finally {
    await prisma.$disconnect();
  }
}
