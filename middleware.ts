import { NextResponse, type NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');
  const isStaticFile = 
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/cron') ||
    request.nextUrl.pathname.includes('.') && !request.nextUrl.pathname.endsWith('/');

  // Allow static files and API auth routes
  if (isStaticFile || isApiAuthRoute) {
    return NextResponse.next({ request });
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured - allowing request (auth unavailable)');
    return NextResponse.next({ request });
  }

  const authenticated = await isAuthenticated();

  // If not authenticated and trying to access protected route
  if (!authenticated && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access login page
  if (authenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
