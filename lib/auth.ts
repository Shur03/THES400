// lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import NextAuthOptions from "next-auth";

export const authOptions: NextAuthOptions = {
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
            password: credentials.password,
          }
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (user?.password !== credentials.password) {
          throw new Error("Нууц үг буруу");
        }

        return { 
          id: user.id.toString(), 
          name: user.name, 
          phone: user.phone 
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

export { handlers, signIn, signOut, auth };