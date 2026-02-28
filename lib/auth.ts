import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const AUTH_COOKIE_NAMES = [
  'sb-access-token',
  'sb-refresh-token',
  'sb-|pcfltspauth|token',
];

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceKey);
}

// Check if user is authenticated via Supabase
export async function isAuthenticated(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, auth unavailable');
    return false;
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get session from cookies
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth session error:', error);
      return false;
    }

    return session !== null;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// Get current authenticated user
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Get user error:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// Sign out user
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  
  for (const name of AUTH_COOKIE_NAMES) {
    cookieStore.delete(name);
  }
}

// Client-side helper - check if we're in browser
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
