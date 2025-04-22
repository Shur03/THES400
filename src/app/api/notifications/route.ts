import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "../../../../lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user_id = Number.parseInt(session.user.id)

    // Get tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    // Get day after tomorrow for range query
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Find medical records due tomorrow
    const upcomingVaccines = await prisma.medicalRecord.findMany({
      where: {
        stock: {
          owner_id: user_id,
        },
        freq_date: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
      include: {
        stock: true,
      },
    })

    return NextResponse.json(upcomingVaccines)
  } catch (error) {
    console.error("Error fetching upcoming vaccines:", error)
    return NextResponse.json({ error: "Failed to fetch upcoming vaccines" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
