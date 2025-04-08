import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const treatment = await prisma.medicalRecord.findUnique({
      where: { id: Number(params.id) },
      include: {
        stock: true
      }
    });

    if (!treatment) {
      return NextResponse.json(
        { error: 'Treatment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(treatment);
  } catch (error) {
    console.error('Error fetching treatment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const updatedTreatment = await prisma.medicalRecord.update({
      where: { id: Number(params.id) },
      data: {
        stock_id: data.stock_id,
        treatment_name: data.treatment_name,
        descrip: data.descrip,
        freq_date: data.freq_date ? new Date(data.freq_date) : null,
      }
    });

    return NextResponse.json(updatedTreatment);
  } catch (error) {
    console.error('Error updating treatment:', error);
    return NextResponse.json(
      { error: 'Failed to update treatment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}