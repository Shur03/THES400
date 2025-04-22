import { NextResponse } from 'next/server';
import { FodderType, PrismaClient } from '@prisma/client';
import { auth } from '../../../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const Purchase = await prisma.fodderPurchase.findUnique({
      where: { id: Number(params.id) },
      include: {
        fodder: true
      }
    });

    if (!Purchase) {
      return NextResponse.json(
        { error: 'Худалдан авалт олдсонгүй' },
        { status: 404 }
      );
    }

    return NextResponse.json(Purchase);
  } catch (error) {
    console.error('Алдаа гарлаа:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const session = await auth();
    const fodderStock = await prisma.fodderStock.findFirst({
      where: {
        owner_id: Number(session?.user?.id),
        types: data.type as FodderType,
      },
    });

    if (!fodderStock) {
      return {
        success: false,
        error: "Өвс тэжээл олдсонгүй.",
      };
    }
    const updatedPurchase = await prisma.fodderPurchase.update({
      where: { id: Number(params.id) },
      data: {
        fodder_id: fodderStock.id,
        weight: data.type === 'tejeel' ? data.weight : null,
        counts: data.type === 'uvs' ? data.counts : null,
        price : data.price,
        buy_date: data.buy_date ? new Date(data.buy_date) : new Date(),
      }
      
      
    });

    return NextResponse.json(updatedPurchase);
  } catch (error) {
    console.error('Худалдан авалтыг шинэчлэхэд алдаа гарлаа', error);
    return NextResponse.json(
      { error: 'Худалдан авалтыг шинэчлэхэд алдаа гарлаа' },
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
      return NextResponse.json({ error: "Худалдан авалтын түүх олдсонгүй" }, { status: 400 });
    }

    const id = Number.parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Худалдан авалтын түүх олдсонгүй" }, { status: 400 });
    }

    const existingPurchase = await prisma.fodderPurchase.findUnique({
      where: { id },
    });

    if (!existingPurchase) {
      return NextResponse.json({ error: "Худалдан авалтын түүх олдсонгүй" }, { status: 404 });
    }

    await prisma.fodderPurchase.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Бүртгэлийг амжилттай устгалаа" }, { status: 200 });
  } catch (error: any) {
    console.error("Устгахад алдаа гарлаа:", error);
    return NextResponse.json(
      { error: 'Шинэчлэхэд алдаа гарлаа' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  
}