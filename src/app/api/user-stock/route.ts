// app/api/user-livestock/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const livestockData = await prisma.liveStock.groupBy({
      by: ['stock_type'],
      where: {
        owner_id: session.user.id
      },
      _count: {
        stock_type: true
      },
      orderBy: {
        _count: {
          stock_type: 'desc'
        }
      }
    });

    return NextResponse.json(livestockData);
  } catch (error) {
    console.error('Error fetching livestock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch livestock data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}