import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         phone: { label: "Phone", type: "text", required: true },
//         password: { label: "Password", type: "password", required: true }
//       },
//       async authorize(credentials) {
//         if (!credentials.phone || !credentials.password) {
//           throw new Error("Нууц үг эсвэл дугаар буруу");
//         }

//         const user = await prisma.herder.findFirst({
//           where: {
//             phone: credentials.phone,
//           }
//         });

//         if (!user) {
//           throw new Error("User not found");
//         }

//         if (user.password !== credentials.password) {
//           throw new Error("Нууц үг буруу");
//         }

//         return { id: user.id.toString(), name: user.name, phone: user.phone };
//       }
//     })
//   ],
//   pages: {
//     signIn: '/auth/signin',
//   },
//   session: {
//     strategy: "jwt" as const,
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default NextAuth(authOptions);
export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
            CredentialsProvider({
              name: "Credentials",
              credentials: {
                phone: { label: "Phone", type: "text", required: true },
                password: { label: "Password", type: "password", required: true }
              },
              async authorize(credentials) {
                if (!credentials.phone || !credentials.password) {
                  throw new Error("Нууц үг эсвэл дугаар буруу");
                }
        
                const user = await prisma.herder.findFirst({
                  where: {
                    phone: credentials.phone,
                  }
                });
        
                if (!user) {
                  throw new Error("User not found");
                }
        
                if (user.password !== credentials.password) {
                  throw new Error("Нууц үг буруу");
                }
        
                return { id: user.id.toString(), name: user.name, phone: user.phone };
              }
            })
          ],
          pages: {
            signIn: '/auth/signin',
          },
          session: {
            strategy: "jwt" as const,
          },
});