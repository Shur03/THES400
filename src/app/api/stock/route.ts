import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const liveStock = await prisma.liveStock.findMany({
        include: {
            owner: true // Include related owner data if needed
        },
      orderBy: {
        id: 'desc' // Optional: order by newest first
      }
    });

    return NextResponse.json(liveStock);
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