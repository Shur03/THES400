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

    const sires = await prisma.sire.findMany({
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

    return NextResponse.json(sires);
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

//POST METHOD
export async function POST(request: Request) {
  
  try {
    const data = await request.json();
    console.log(data);
  // Validate required fields
  if (!data.stock_id ) {
    return NextResponse.json(
      { error: "Малын төрөл заавал шаардлагатай." },
      { status: 400 }
    );
  }

    const sire = await prisma.sire.create({
      data: {
        stock_id: data.stock_id,
        name: data.name,
        breed: data.breed,
        weight: data.weight,
        year : data.year,
        age: data.age,
      },
    });

    return NextResponse.json({ success: true, sire });
  } catch (error) {
    console.error("Create sire error:", error);
    return NextResponse.json(
      { error: "Бүртгэл үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
//DELETE METHOD
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "Устгахад алдаа гарлаа" }, { status: 400 });
    }

    const id = Number.parseInt(params.id, 10);

    const sire = await prisma.sire.findUnique({
      where: { id },
    });

    if (!sire) {
      return NextResponse.json({ error: "Бүртгэл олдсонгүй" }, { status: 404 });
    }

    await prisma.sire.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Амжилттай устгалаа" }, { status: 200 });
  } catch (error: any) {
    console.error("Устгахад алдаа гарлаа:", error);
    return NextResponse.json(
      { error: 'Хадгалахад алдаа гарлаа' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  
}