import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Server-side client with service role key (bypasses RLS for auth checks)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

// Helper to get authenticated user from server-side
export async function getAuthenticatedUser() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Auth check error:', error);
    return null;
  }
}

// Check if user is authenticated (for middleware)
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  return user !== null;
}

// Get current user
export async function getCurrentUser() {
  return getAuthenticatedUser();
}

// Sign out (server-side)
export async function signOut() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const cookieStore = await cookies();
  
  // Get all cookies and clear them
  const allCookies = cookieStore.getAll();
  
  for (const cookie of allCookies) {
    if (cookie.name.startsWith('sb-')) {
      cookieStore.delete(cookie.name);
    }
  }
  
  // Also try to sign out from Supabase
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
  }
}
