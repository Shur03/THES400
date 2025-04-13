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
//delete method
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "Treatment ID is required" }, { status: 400 });
    }

    const id = Number.parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid treatment ID" }, { status: 400 });
    }

    const existingTreatment = await prisma.medicalRecord.findUnique({
      where: { id },
    });

    if (!existingTreatment) {
      return NextResponse.json({ error: "Treatment not found" }, { status: 404 });
    }

    await prisma.medicalRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Treatment deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting treatment:", error);
    return NextResponse.json(
      { error: 'Failed to update treatment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  
}