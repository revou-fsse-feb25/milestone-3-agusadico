import { NextResponse } from 'next/server';
import { auth } from './auth';
 
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.role;
  
  // Protect checkout route - requires any authenticated user
  if (nextUrl.pathname.startsWith('/checkout') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }
  
  // Protect admin routes - requires admin role
  if (nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    
    // Check if user has admin role
    if (userRole !== 'admin') {
      // User is authenticated but not admin, redirect to unauthorized page or home
      return NextResponse.redirect(new URL('/?error=unauthorized', nextUrl));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};