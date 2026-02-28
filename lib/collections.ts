import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

export interface Collection {
  id: number;
  name: string;
  description: string | null;
  photo_url: string | null;
  search_term: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionWithStats extends Collection {
  zippo_count: number;
  total_value: number;
}

export async function getAllCollections(): Promise<CollectionWithStats[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('collection_stats')
    .select('*')
    .order('name');
  return (data || []).map(d => ({ ...d, total_value: Number(d.total_value) || 0 }));
}

export async function getCollectionById(id: number): Promise<Collection | null> {
  const supabase = await getSupabase();
  const { data } = await supabase.from('collections').select('*').eq('id', id).single();
  return data;
}

export async function createCollection(input: {
  name: string;
  description?: string;
  photo_url?: string;
  search_term?: string;
  is_complete?: boolean;
}): Promise<Collection> {
  const supabase = await getSupabase();
  const { data } = await supabase.from('collections').insert(input).select().single();
  return data!;
}

export async function deleteCollection(id: number) {
  const supabase = await getSupabase();
  await supabase.from('collections').delete().eq('id', id);
}
