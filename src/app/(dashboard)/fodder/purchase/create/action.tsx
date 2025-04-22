"use server";

import { FodderType, PrismaClient } from "@prisma/client";
import { auth } from "../../../../../../lib/auth";

const prisma = new PrismaClient();

export async function create(formData: {
  type: string;
  weight?: number;
  counts?: number;
  buy_date?: Date;
  price?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Нэвтрэх шаардлагатай." };
    }

    // Determine initial quantity based on type
    const initialQuantity =
      formData.type === "tejeel" ? formData.weight || 0 : formData.counts || 0;

    // Find or create fodder stock
    let fodderStock = await prisma.fodderStock.findFirst({
      where: {
        owner_id: Number(session.user.id),
        types: formData.type as FodderType,
      },
    });

    if (!fodderStock) {
      fodderStock = await prisma.fodderStock.create({
        data: {
          owner_id: Number(session.user.id),
          types: formData.type as FodderType,
          quantity: initialQuantity,
        },
      });
    } else {
      // Update existing stock
      fodderStock = await prisma.fodderStock.update({
        where: { id: fodderStock.id },
        data: {
          quantity: {
            increment: initialQuantity,
          },
        },
      });
    }

    // Create the purchase record
    const fodder = await prisma.fodderPurchase.create({
      data: {
        fodder_id: fodderStock.id,
        weight: formData.weight,
        counts: formData.counts,
        price: formData.price,
        buy_date: formData.buy_date ?? new Date(),
      },
    });

    return { success: true, fodder };
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
