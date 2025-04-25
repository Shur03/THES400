"use server";

import { EventType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function create(formData: {
  stock_id: number;
  type: string;
  count: number;
  descrip: string;
  event_date: string;
}): Promise<{
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}> {
  try {
    // Input validations
    if (formData.stock_id <= 0) {
      return {
        success: false,
        errors: { stock_id: ["Малын төрөл сонгоно уу"] },
      };
    }

    if (!formData.type) {
      return {
        success: false,
        errors: { type: ["Төрөл сонгоно уу"] },
      };
    }

    if (formData.count <= 0) {
      return {
        success: false,
        errors: { count: ["Тоо толгой 0-ээс их байх ёстой"] },
      };
    }

    // Get current stock info
    const currentStock = await prisma.liveStock.findUnique({
      where: { id: formData.stock_id },
    });

    if (!currentStock) {
      return {
        success: false,
        message: "Сонгосон малын бүртгэл олдсонгүй",
      };
    }

    // Calculate the adjustment
    const adjustment =
      formData.type === "inc" ? formData.count : -formData.count;

    const newCount = currentStock.counts + adjustment;

    // Prevent negative stock count
    if (newCount < 0) {
      return {
        success: false,
        errors: { count: ["Малын тоо хасах үед 0-ээс бага байж болохгүй"] },
      };
    }

    // Create the event record
    await prisma.eventRecord.create({
      data: {
        stock_id: formData.stock_id,
        event_type: formData.type as EventType,
        counts: formData.count,
        descrip: formData.descrip,
        event_date: formData.event_date ? new Date(formData.event_date) : null,
      },
    });

    // Update the stock count
    await prisma.liveStock.update({
      where: { id: formData.stock_id },
      data: {
        counts: newCount,
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
