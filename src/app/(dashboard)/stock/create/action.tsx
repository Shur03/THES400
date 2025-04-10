"use server";

import { EventType, PrismaClient, StockType } from "@prisma/client";

const prisma = new PrismaClient();

export async function create(formData: {
  type: string;
  counts: number;
}): Promise<{
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}> {
  try {
    if (!formData.type) {
      return {
        success: false,
        errors: { type: ["Төрөл сонгоно уу"] },
      };
    }

    if (formData.counts <= 0) {
      return {
        success: false,
        errors: { count: ["Тоо толгой 0-ээс их байх ёстой"] },
      };
    }

    const event = await prisma.liveStock.create({
      data: {
        owner_id: 1, // TODO: Replace with actual owner ID
        stock_type: formData.type as StockType,
        counts: formData.counts,
      },
    });

    return {
      success: true,
      message: "Бүртгэл амжилттай хадгалагдлаа!",
    };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return {
      success: false,
      message: error.message || "Алдаа гарлаа, дахин оролдоно уу",
      errors: error.errors,
    };
  } finally {
    await prisma.$disconnect();
  }
}
