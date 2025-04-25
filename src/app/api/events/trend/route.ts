import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as string | null;
    
    const user_id = parseInt(session.user.id);
    
    // Get all event records filtered by type if provided
    const eventRecords = await prisma.eventRecord.findMany({
      where: {
        stock: {
          owner_id: user_id,
        //   ...(type ? { stock_type: type } : {})
        }
      },
      include: {
        stock: true 
      },
      orderBy: {
        event_date: 'asc'
      }
    });
    
    const transformedData = eventRecords.map(record => ({
      id: record.id,
      stock_type: record.stock.stock_type,
      counts: record.counts,
    //   date: record.event_date.toISOString().split('T')[0],
      event_type: record.event_type
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error processing event records:', error);
    return NextResponse.json(
      { error: 'Failed to process event records' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}