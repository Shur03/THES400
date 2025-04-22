import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET() {
   const session = await auth();
   if (!session?.user?.id) {
     return {
       success: false,
       message: "Хэрэглэгчийн мэдээлэл олдсонгүй. Нэвтэрч орно уу.",
     };
   }
  try {
    const liveStock = await prisma.liveStock.findMany({
      where: {
        //Нэвтэрч орсон хэрэглэгчийн мал сүргийн мэдээллийг харуулна.
        owner_id: parseInt(session.user.id),
      },
      orderBy: {
        id: 'asc' 
      }
    });

    return NextResponse.json(liveStock);
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