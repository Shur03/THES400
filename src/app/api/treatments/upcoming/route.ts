// app/api/treatments/upcoming/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
// import { authOptions } from '@../..';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }

  try {
    const upcoming = await prisma.medicalRecord.findMany({
      where: {
        stock: {
          owner_id: session.user.id ? parseInt(session.user.id, 10) : undefined
        },
        freq_date: {
          gte: new Date(), // Only future dates
          lt: new Date(new Date().setDate(new Date().getDate() + 30)) // Next 30 days
        }
      },
      select: {
        id: true,
        treatment_name: true,
        freq_date: true,
        stock: {
          select: {
            stock_type: true
          }
        }
      },
      orderBy: {
        freq_date: 'asc'
      },
      take: 5 // Limit to 5 upcoming treatments
    });

    const formatted = upcoming.map(t => ({
      id: t.id,
      treatment_name: t.treatment_name,
      freq_date: t.freq_date ? t.freq_date.toISOString() : null,
      stock_type: t.stock.stock_type
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching upcoming treatments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming treatments' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}