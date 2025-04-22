import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sire = await prisma.sire.findUnique({
      where: { id: Number(params.id) },
      include: {
        stock: true
      }
    });

    if (!sire) {
      return NextResponse.json(
        { error: 'Sire not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sire);
  } catch (error) {
    console.error('Error fetching sire:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sire' },
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
    
    const updatedSire = await prisma.sire.update({
      where: { id: Number(params.id) },
      data: {
        stock_id: data.stock_id,
        name : data.name,
        breed: data.breed,
        weight : data.weight,
      }
    });

    return NextResponse.json(updatedSire);
  } catch (error) {
    console.error('Error updating sire:', error);
    return NextResponse.json(
      { error: 'Failed to update sire' },
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
      return NextResponse.json({ error: "Sire ID is required" }, { status: 400 });
    }

    const id = Number.parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid sire ID" }, { status: 400 });
    }

    const existingSire = await prisma.sire.findUnique({
      where: { id },
    });

    if (!existingSire) {
      return NextResponse.json({ error: "Sire not found" }, { status: 404 });
    }

    await prisma.sire.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Sire deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting sire:", error);
    return NextResponse.json(
      { error: 'Failed to update sire' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  
}