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

export interface ZippoWithPrice {
  id: number;
  collection_id: number;
  name: string;
  description: string | null;
  photo_url: string | null;
  search_term: string | null;
  condition: string;
  purchase_price: number | null;
  bottom_stamp: string | null;
  notes: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  avg_price: number | null;
  min_price: number | null;
  max_price: number | null;
  num_sold: number | null;
  last_fetched: string | null;
}

export async function getZipposByCollection(collectionId: number): Promise<ZippoWithPrice[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('zippos_with_prices')
    .select('*')
    .eq('collection_id', collectionId)
    .order('position')
    .order('id');
  return (data || []).map(d => ({
    ...d,
    avg_price: d.avg_price ? Number(d.avg_price) : null,
    min_price: d.min_price ? Number(d.min_price) : null,
    max_price: d.max_price ? Number(d.max_price) : null,
  }));
}

export async function getZippoById(id: number): Promise<ZippoWithPrice | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('zippos_with_prices')
    .select('*')
    .eq('id', id)
    .single();
  if (!data) return null;
  return {
    ...data,
    avg_price: data.avg_price ? Number(data.avg_price) : null,
    min_price: data.min_price ? Number(data.min_price) : null,
    max_price: data.max_price ? Number(data.max_price) : null,
  };
}

export async function createZippo(input: {
  collection_id: number;
  name: string;
  description?: string;
  photo_url?: string;
  search_term?: string;
  condition?: string;
  purchase_price?: number;
  bottom_stamp?: string;
  notes?: string;
  position?: number;
}) {
  const supabase = await getSupabase();
  const { data } = await supabase.from('zippos').insert(input).select().single();
  return data!;
}

export async function updateZippo(id: number, input: Record<string, any>) {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('zippos')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return data;
}

export async function deleteZippo(id: number) {
  const supabase = await getSupabase();
  await supabase.from('zippos').delete().eq('id', id);
}
