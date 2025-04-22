import { NextResponse } from 'next/server';
import { FodderType, PrismaClient } from '@prisma/client';
import { auth } from '../../../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.fodderRecord.findUnique({
      where: { id: Number(params.id) },
      include: {
        fodder: true
      }
    });

    if (!record) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch record' },
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
    const session = await auth();
    const fodderStock = await prisma.fodderStock.findFirst({
      where: {
        owner_id: Number(session?.user?.id),
        types: data.type as FodderType,
      },
    });

    if (!fodderStock) {
      return {
        success: false,
        error: "олдсонгүй.",
      };
    }
    const updatedRecord = await prisma.fodderRecord.update({
      where: { id: Number(params.id) },
        data: {
            fodder_id: fodderStock.id,
            quantity_used: data.quantity_used,
            used_date: data.used_date ? new Date(data.used_date) : new Date(),
          },
      
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json(
      { error: 'Failed to update record' },
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
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    const id = Number.parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    }

    const existingRecord = await prisma.fodderRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    await prisma.fodderRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Reecord deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: 'Failed to update records' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  
}