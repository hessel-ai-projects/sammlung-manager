import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear auth cookies
    const cookieStore = await cookies();
    const authCookies = ['sb-access-token', 'sb-refresh-token', 'sb-|pcfltspauth|token'];
    
    for (const cookieName of authCookies) {
      cookieStore.delete(cookieName);
    }
  } catch (error) {
    console.error('Sign out error:', error);
  }

  // Get the host from request for proper redirect
  const url = new URL(request.url);
  const redirectUrl = `${url.protocol}//${url.host}/login`;

  // Redirect to login
  return NextResponse.redirect(redirectUrl, { status: 302 });
}

export async function GET(request: Request) {
  return POST(request);
}
