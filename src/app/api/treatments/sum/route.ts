// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import { auth } from '../../../../../lib/auth';

// const prisma = new PrismaClient();

// export async function GET() {
//   const session = await auth();
  
//   if (!session?.user?.id) {
//     return NextResponse.json(
//       { success: false, message: "Хэрэглэгчийн мэдээлэл олдсонгүй. Нэвтэрч орно уу." },
//       { status: 401 }
//     );
//   }

//   try {
//     // Get the total sum of all livestock counts for the logged-in user
//     const totalStock = await prisma.medicalRecord.aggregate({
//       where: {
//           stock: {
//       owner_id: session?.user.id,  // Зөвхөн эзэмшигчийн өгөгдөл
//     },
//       },
//       _sum: {
//         counts: true,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       totalCount: totalStock._sum.counts || 0, // Default to 0 if null
//     });
//   } catch (error) {
//     console.error('Error fetching total stock count:', error);
//     return NextResponse.json(
//       { success: false, error: 'Малын нийт тоог авахад алдаа гарлаа' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }