import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Create server client for auth checks
async function getServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from Server Component
        }
      },
    },
  });
}

// Check if user is authenticated via Supabase
export async function isAuthenticated(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured');
    return false;
  }

  try {
    const supabase = await getServerClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.log('Auth check error:', error.message);
      return false;
    }

    console.log('Auth check:', session ? 'authenticated' : 'not authenticated');
    return session !== null;
  } catch (error: any) {
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
    const supabase = await getServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// Client-side helper - check if we're in browser
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
