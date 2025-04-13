import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../../../lib/auth';

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

    const fodderRecord = await prisma.fodderRecord.findMany({
      where: {
        fodder: {
          owner_id: user_id
        }
      },
      include: {
        fodder: true 
      },
      orderBy: {
        id: 'asc' 
      }
    });

    return NextResponse.json(fodderRecord);
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
//delete method
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "fodder ID is required" }, { status: 400 });
    }

    const id = Number.parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid fodder ID" }, { status: 400 });
    }

    const existingfodder = await prisma.fodderRecord.findUnique({
      where: { id },
    });

    if (!existingfodder) {
      return NextResponse.json({ error: "fodder not found" }, { status: 404 });
    }

    await prisma.fodderRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: "fodder deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting fodder:", error);
    return NextResponse.json(
      { error: 'Failed to update fodder' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  
}