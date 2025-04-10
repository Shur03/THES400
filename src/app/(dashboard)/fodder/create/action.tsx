"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function create(formData: {
  fodder_id: number;
  type: string;
  // quantity_used : number,
  // used_date : Date,
  weight: number;
  counts: number;
  buy_date: Date;
}) {
  try {
    const treatment = prisma.fodderPurchase.create({
      data: {
        fodder_id: formData.fodder_id,
        weight: formData.weight,
        counts: formData.counts,
        buy_date: formData.buy_date ? new Date(formData.buy_date) : new Date(),
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
