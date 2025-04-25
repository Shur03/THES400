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

    // Helper function to determine initial quantity based on fodder type
    function getInitialQuantity(
      type: string,
      weight?: number,
      counts?: number
    ): number {
      switch (type) {
        case "tejeel":
          return weight || 0;
        case "uvs":
          return counts || 0;
        default:
          // You can define additional logic here for other types if needed
          return counts || 0;
      }
    }

    const initialQuantity = getInitialQuantity(
      formData.type,
      formData.weight,
      formData.counts
    );

    // Find existing fodder stock
    let fodderStock = await prisma.fodderStock.findFirst({
      where: {
        owner_id: Number(session.user.id),
        types: formData.type as FodderType,
      },
    });

    if (!fodderStock) {
      // Create new fodder stock
      fodderStock = await prisma.fodderStock.create({
        data: {
          owner_id: Number(session.user.id),
          types: formData.type as FodderType,
          quantity: initialQuantity,
        },
      });
    } else {
      // Update existing stock by increasing the quantity
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
