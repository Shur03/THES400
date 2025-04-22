"use server";
import { PrismaClient, StockType } from "@prisma/client";
import { auth } from "../../../../../lib/auth";

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

    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Хэрэглэгчийн мэдээлэл олдсонгүй. Нэвтэрч орно уу.",
      };
    }

    const validStockTypes = Object.values(StockType);
    if (!validStockTypes.includes(formData.type as StockType)) {
      return {
        success: false,
        errors: { type: ["Малын төрөл буруу байна"] },
      };
    }

    // ✅ Шинээр нэмэхийн өмнө тухайн хэрэглэгч тухайн төрлийг бүртгэсэн эсэхийг шалгах
    const existing = await prisma.liveStock.findFirst({
      where: {
        owner_id: parseInt(session.user.id, 10),
        stock_type: formData.type as StockType,
      },
    });

    if (existing) {
      return {
        success: false,
        message: "Энэ төрлийн мал өмнө нь бүртгэгдсэн байна.",
      };
    }

    // ✅ Хадгалах
    await prisma.liveStock.create({
      data: {
        owner_id: parseInt(session.user.id, 10),
        stock_type: formData.type as StockType,
        counts: formData.counts,
      },
    });

    return {
      success: true,
      message: "Бүртгэл амжилттай хадгалагдлаа!",
    };
  } catch (error: any) {
    console.error("Error creating livestock:", error);
    return {
      success: false,
      message: error.message || "Алдаа гарлаа, дахин оролдоно уу",
    };
  } finally {
    await prisma.$disconnect();
  }
}
