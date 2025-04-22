import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth, authOptions } from '../../../../lib/auth';


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
//post method


export async function create(formData: {
  stock_id: number;
  treatment_name: string;
  descrip: string;
  freq_date: string;
}) {
  try {
    const treatment = prisma.medicalRecord.create({
      data: {
        stock_id: formData.stock_id,
        treatment_name: formData.treatment_name,
        descrip: formData.descrip,
        freq_date: formData.freq_date ? new Date(formData.freq_date) : null,
      },
    });

    return { success: true, treatment };
  } catch (error) {
    console.error("Error creating treatment:", error);
    return { success: false, error: "Failed to create treatment" };
  } finally {
    await prisma.$disconnect();
  }
}

//delete method
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "Treatment ID is required" }, { status: 400 });
    }

    const id = Number.parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid treatment ID" }, { status: 400 });
    }

    const existingTreatment = await prisma.medicalRecord.findUnique({
      where: { id },
    });

    if (!existingTreatment) {
      return NextResponse.json({ error: "Treatment not found" }, { status: 404 });
    }

    await prisma.medicalRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Treatement deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting treatment:", error);
    return NextResponse.json(
      { error: 'Failed to update treatment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  
}