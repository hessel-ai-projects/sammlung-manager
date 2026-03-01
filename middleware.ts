import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');
  const isStaticFile = 
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/cron') ||
    (request.nextUrl.pathname.includes('.') && !request.nextUrl.pathname.endsWith('/'));

  // Allow static files and API auth routes
  if (isStaticFile || isApiAuthRoute) {
    return response;
  }

  // Create Supabase client with cookie handling
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase not configured - allowing request');
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Check session
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;

  console.log('Middleware check:', { 
    path: request.nextUrl.pathname, 
    isAuthenticated, 
    isAuthRoute 
  });

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access login page
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
