// app/api/treatments/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const medicalRecords = await prisma.medicalRecord.findMany({
      include: {
        stock: true // Include related livestock data if needed
      },
      orderBy: {
        id: 'desc' // Optional: order by newest first
      }
    });

    return NextResponse.json(medicalRecords);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}