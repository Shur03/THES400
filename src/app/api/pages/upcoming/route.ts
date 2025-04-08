// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { Session } from 'next-auth';
// // import { authOptions } from '@../..';
// import { PrismaClient } from '@prisma/client';
// import { authOptions } from '../../../../../lib/auth';

// const prisma = new PrismaClient();

// export async function GET() {
//   const session: Session | null = await getServerSession(authOptions);

//   if (!session || !session.user) {
//     return NextResponse.json(
//       { error: 'Unauthorized access' },
//       { status: 401 }
//     );
//   }

//   try {
//     const upcoming = await prisma.liveStock.findMany({
//       // where: {
        
//       // },
//       select: {
//         id: true,
//         stock_type: true,
//         counts: true,
        
//       },
//       orderBy: {
//         id: 'asc'
//       },
//     });

//     const formatted = upcoming.map(s => ({
//       id: s.id,
//       stock_type: s.stock_type,
//       counts: s.counts 
//     }));

//     return NextResponse.json(formatted);
//   } catch (error) {
//     console.error('алдаа гарлаа:', error);
//     return NextResponse.json(
//       { error: 'Алдаа гарлаа.' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }