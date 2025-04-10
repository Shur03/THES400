import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // If not logged in and NOT already going to login, redirect to login
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access login, redirect to home/dashboard
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg)$).*)'],
};