import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.eventRecord.findUnique({
      where: { id: Number(params.id) },
      include: {
        stock: true
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
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
    
    const updatedEvent = await prisma.eventRecord.update({
      where: { id: Number(params.id) },
      data: {
        stock_id: data.stock_id,
        event_type: data.event_type,
        counts : data.counts,
        descrip: data.descrip,
        event_date: data.event_date ? new Date(data.event_date) : null,
      }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
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
      return NextResponse.json({ error: "event ID is required" }, { status: 400 });
    }

    const id = Number.parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const existingEvent = await prisma.eventRecord.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.eventRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  
}