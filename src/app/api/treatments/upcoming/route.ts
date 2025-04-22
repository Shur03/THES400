import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const upcomingOnly = searchParams.get('upcoming') === 'true';
    const singleClosest = searchParams.get('single') === 'true'; // New parameter
    
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const today = new Date();
    
    // Find the single closest upcoming record
    if (singleClosest) {
      const closestRecord = await prisma.medicalRecord.findFirst({
        where: {
          stock: {
            owner_id: userId
          },
          freq_date: {
            gte: today // Future dates only
          }
        },
        include: {
          stock: true 
        },
        orderBy: {
          freq_date: 'asc' // Closest date first
        }
      });

      return NextResponse.json(closestRecord || null);
    }

    // Original logic for multiple records
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        stock: {
          owner_id: userId
        },
        ...(upcomingOnly && {
          freq_date: {
            gte: today
          }
        }) 
      },
      include: {
        stock: true 
      },
      orderBy: {
        freq_date: upcomingOnly ? 'asc' : 'desc'
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