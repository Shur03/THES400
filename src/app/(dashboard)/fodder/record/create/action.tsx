"use server";

import { FodderType, PrismaClient } from "@prisma/client";
import { auth } from "../../../../../../lib/auth";

const prisma = new PrismaClient();

export async function create(formData: {
  type: string;
  quantity_used: number;
  used_date?: Date;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Нэвтрэх шаардлагатай." };
    }

    const fodderStock = await prisma.fodderStock.findFirst({
      where: {
        owner_id: Number(session.user.id),
        types: formData.type as FodderType,
      },
    });

    if (!fodderStock) {
      return { success: false, error: "Тухайн төрлийн тэжээл олдсонгүй." };
    }

    const quantityAvailable = fodderStock.quantity;
    const quantityToUse = formData.quantity_used;

    if (quantityAvailable < quantityToUse) {
      return {
        success: false,
        error: `Хүрэлцэхгүй байна. Боломжит хэмжээ: ${quantityAvailable}`,
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const fodderRecord = await tx.fodderRecord.create({
        data: {
          fodder_id: fodderStock.id,
          quantity_used: quantityToUse,
          used_date: formData.used_date ?? new Date(),
        },
      });

      await tx.fodderStock.update({
        where: { id: fodderStock.id },
        data: {
          quantity: {
            decrement: quantityToUse,
          },
        },
      });

      return fodderRecord;
    });

    return { success: true, fodder: result };
  } catch (error) {
    console.error("Хадгалахад алдаа гарлаа:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Алдаа гарлаа.",
    };
  } finally {
    await prisma.$disconnect();
  }
}
