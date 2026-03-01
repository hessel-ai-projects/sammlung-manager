import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { scrapeEbaySoldListings } from '@/lib/ebay-scraper-robust';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST() {
  try {
    // Check auth
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all zippos
    const { data: zippos, error: zipposError } = await supabase
      .from('zippos')
      .select('*');

    if (zipposError) {
      return NextResponse.json({ error: zipposError.message }, { status: 500 });
    }

    const results = [];
    const errors = [];

    for (const zippo of zippos || []) {
      if (!zippo.search_term) continue;

      try {
        const stats = await scrapeEbaySoldListings(zippo.search_term);
        
        if (stats.numSold > 0) {
          // Save to price_snapshots
          const { error: snapshotError } = await supabase
            .from('price_snapshots')
            .insert({
              zippo_id: zippo.id,
              avg_price: stats.avgPrice,
              min_price: stats.minPrice,
              max_price: stats.maxPrice,
              num_sold: stats.numSold,
              source: 'ebay_api',
            });

          if (snapshotError) throw snapshotError;

          // Save to price_history
          const { error: historyError } = await supabase
            .from('price_history')
            .insert({
              zippo_id: zippo.id,
              avg_price: stats.avgPrice,
              min_price: stats.minPrice,
              max_price: stats.maxPrice,
              num_sold: stats.numSold,
              source: 'ebay_api',
            });

          if (historyError) throw historyError;

          results.push({ zippo: zippo.name, price: stats.avgPrice });
        }
      } catch (error: any) {
        errors.push({ zippo: zippo.name, error: error.message });
      }

      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
      success: true,
      updated: results.length,
      errors: errors.length,
      results,
      errorDetails: errors,
    });

  } catch (error: any) {
    console.error('Update prices error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
