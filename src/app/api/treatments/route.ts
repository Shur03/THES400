import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { getServerSession } from "next-auth/next";
import { auth, authOptions } from '../../../../lib/auth';


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

    const medicalRecords = await prisma.medicalRecord.findMany({
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

    return NextResponse.json(medicalRecords);
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