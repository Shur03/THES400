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
    const eventRecord = await prisma.eventRecord.findMany({
      where: {
        stock: {
          owner_id: user_id
        }
      },
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