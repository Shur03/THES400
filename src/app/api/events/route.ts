import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user_id = parseInt(session.user.id);
    
    // First get all event records
    const eventRecords = await prisma.eventRecord.findMany({
      where: {
        stock: {
          owner_id: user_id
        }
      },
      include: {
        stock: true 
      },
      orderBy: {
        id: 'desc' 
      }
    });
    return NextResponse.json(eventRecords);
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