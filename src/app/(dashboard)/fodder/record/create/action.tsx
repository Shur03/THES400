"use server";

import { FodderType, PrismaClient } from "@prisma/client";
import { auth } from "../../../../../../lib/auth";

const prisma = new PrismaClient();

export async function create(formData: {
  type: string;
  quantity_used: number;
  used_date: Date;
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
    const fodder = await prisma.fodderRecord.create({
      data: {
        fodder_id: fodderStock.id,
        quantity_used: formData.quantity_used,
        used_date: formData.used_date
          ? new Date(formData.used_date)
          : new Date(),
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
