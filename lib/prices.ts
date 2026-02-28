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

export async function savePriceSnapshot(data: {
  zippo_id?: number;
  collection_id?: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  num_sold: number;
  source?: string;
}) {
  const supabase = await getSupabase();
  
  // Save to price_snapshots
  await supabase.from('price_snapshots').insert({
    ...data,
    source: data.source || 'ebay',
  });

  // Save to price_history if zippo_id provided
  if (data.zippo_id && data.avg_price > 0) {
    await supabase.from('price_history').insert({
      zippo_id: data.zippo_id,
      avg_price: data.avg_price,
      min_price: data.min_price,
      max_price: data.max_price,
      num_sold: data.num_sold,
    });
  }
}

export async function getTotalValue(): Promise<number> {
  const supabase = await getSupabase();
  const { data } = await supabase.from('collection_stats').select('total_value');
  if (!data) return 0;
  return data.reduce((sum, d) => sum + (Number(d.total_value) || 0), 0);
}

// Get price history for a zippo (last 12 months)
export async function getPriceHistory(zippoId: number): Promise<{
  recorded_at: string;
  avg_price: number;
  min_price: number;
  max_price: number;
}[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('price_history')
    .select('recorded_at, avg_price, min_price, max_price')
    .eq('zippo_id', zippoId)
    .order('recorded_at', { ascending: true })
    .limit(365); // Last year
  
  return (data || []).map(d => ({
    recorded_at: d.recorded_at,
    avg_price: Number(d.avg_price),
    min_price: Number(d.min_price),
    max_price: Number(d.max_price),
  }));
}

// Get total value history (last 12 months)
export async function getTotalValueHistory(): Promise<{
  recorded_at: string;
  total_value: number;
}[]> {
  const supabase = await getSupabase();
  
  // Get all price history entries
  const { data } = await supabase
    .from('price_history')
    .select('recorded_at, avg_price')
    .order('recorded_at', { ascending: true })
    .limit(1000);
  
  if (!data || data.length === 0) return [];

  // Group by date and sum up values
  const valueByDate: Record<string, number> = {};
  
  for (const entry of data) {
    const date = entry.recorded_at.split('T')[0];
    if (!valueByDate[date]) {
      valueByDate[date] = 0;
    }
    valueByDate[date] += Number(entry.avg_price);
  }

  return Object.entries(valueByDate).map(([recorded_at, total_value]) => ({
    recorded_at,
    total_value: Math.round(total_value * 100) / 100,
  }));
}
