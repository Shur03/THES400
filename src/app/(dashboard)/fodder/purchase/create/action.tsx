"use server";

import { FodderType, PrismaClient } from "@prisma/client";
import { auth } from "../../../../../../lib/auth";

const prisma = new PrismaClient();

export async function create(formData: {
  type: string;
  weight: number;
  counts: number;
  buy_date: Date;
}) {
  try {
    const session = await auth();
    const fodderStock = await prisma.fodderStock.findFirst({
      where: {
        owner_id: Number(session?.user?.id),
        types: formData.type as FodderType,
      },
    });

    if (!fodderStock) {
      return {
        success: false,
        error: "олдсонгүй.",
      };
    }
    const fodder = await prisma.fodderPurchase.create({
      data: {
        fodder_id: fodderStock.id,
        weight: formData.weight,
        counts: formData.counts,
        buy_date: formData.buy_date ? new Date(formData.buy_date) : new Date(),
      },
    });

    return { success: true, fodder };
  } catch (error) {
    console.error("Хадгалахад алдаа гарлаа :", error);
    return { success: false, error: "Алдаа гарлаа." };
  } finally {
    await prisma.$disconnect();
  }
}
