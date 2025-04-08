import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const eventRecord = await prisma.eventRecord.findMany({
      include: {
        stock: true // Include related livestock data if needed
      },
      orderBy: {
        id: 'desc' // Optional: order by newest first
      }
    });

    return NextResponse.json(eventRecord);
  } catch (error) {
    console.error('Error fetching event records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event records' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}