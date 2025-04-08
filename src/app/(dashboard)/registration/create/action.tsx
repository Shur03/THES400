// app/(dashboard)/registration/create/action.ts
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
    // Basic validation
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

    const event = await prisma.eventRecord.create({
      data: {
        stock_id: formData.stock_id,
        event_type: formData.type as EventType,
        counts: formData.count,
        descrip: formData.descrip,
        event_date: formData.event_date ? new Date(formData.event_date) : null,
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
