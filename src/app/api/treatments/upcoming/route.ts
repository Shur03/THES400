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

    const userId = parseInt(session.user.id);
    const today = new Date();
    
    const upcoming = await prisma.medicalRecord.findFirst({
  where: {
    stock: {
      owner_id: userId,  // Зөвхөн эзэмшигчийн өгөгдөл
    },
    freq_date: {
      gte: today,  // Одооноос хойшхи өдрүүд
    },
  },
  include: {
    stock: true,  // Холбоотой stock мэдээллийг хамт авна
  },
  orderBy: {
    freq_date: 'asc',  // Хамгийн ойрын өдрөөр эрэмбэлнэ
  },
});

    return NextResponse.json(upcoming);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}