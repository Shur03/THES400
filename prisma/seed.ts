// import { PrismaClient, Prisma } from '@prisma/client'

// const prisma = new PrismaClient()

// // const fodderData : Prisma.FodderCreateInput[] = [{
// //  types: 'tejeel',
// //  counts: 0, 
// // }
// // ]
// const userData : Prisma.UserCreateInput[] = [{
// name: 'shur',
// phone : '99976306',
// password :'$2b$10$3'
// }, 
// {name: 'test',
//   phone : '99887766',
//   password :'1234567'
//   }
// ]
// // const fodderData : Prisma.FodderStockCreateInput = [
// //   {
// // types : 'uvs',
// // owner_id : '1',

// //   }
// // ]
// export async function main() {
//   for (const u of userData) {
//     await prisma.user.create({ data: u })
//   }
//   console.log(`Created ${userData.length} users`)
// }
// main()
//   .then(() => prisma.$disconnect())
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })