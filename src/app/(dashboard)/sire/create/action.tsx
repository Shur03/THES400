"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../lib/auth";

const prisma = new PrismaClient();

export async function create(formData: {
  stock_id: number;
  name: string;
  breed: string;
  weight: number;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Нэвтрэх шаардлагатай." };
    }

    const sire = prisma.sire.create({
      data: {
        stock_id: formData.stock_id,
        name: formData.name,
        breed: formData.breed,
        weight: formData.weight,
      },
    });

    return { success: true, sire };
  } catch (error) {
    console.error("Error creating sire:", error);
    return { success: false, error: "Failed to create sire" };
  } finally {
    await prisma.$disconnect();
  }
}
