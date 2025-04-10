import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the current session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user_id = parseInt(session.user.id);

    const fodderPurchase = await prisma.fodderPurchase.findMany({
      orderBy: {
        id: 'desc' 
      }
    });

    return NextResponse.json(fodderPurchase);
  } catch (error) {
    console.error('Error fetching fodder records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fodder records' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}