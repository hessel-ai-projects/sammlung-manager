import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for browser (uses anon key, RLS applies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client for server-side operations (still uses anon key, relies on RLS)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
