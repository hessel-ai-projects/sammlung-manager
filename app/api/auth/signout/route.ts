import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const cookieStore = request.headers.get('cookie') || '';
    
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          // Parse cookies from header
          return cookieStore.split('; ').filter(Boolean).map(cookie => {
            const [name, ...rest] = cookie.split('=');
            return { name, value: rest.join('=') };
          });
        },
        setAll(cookiesToSet) {
          // Cookies werden durch Response-Headers gesetzt
        },
      },
    });
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error('Sign out error:', error);
  }

  // Create response with redirect
  const url = new URL(request.url);
  const response = NextResponse.redirect(`${url.protocol}//${url.host}/login`, { 
    status: 302 
  });

  // Clear auth cookies by setting them to expire
  const authCookies = [
    'sb-access-token',
    'sb-refresh-token', 
    'sb-|pcfltspauth|token',
  ];
  
  for (const name of authCookies) {
    response.cookies.set(name, '', { 
      maxAge: 0,
      path: '/',
    });
  }

  return response;
}

export async function GET(request: Request) {
  return POST(request);
}
