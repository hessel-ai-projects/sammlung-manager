import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { scrapeEbaySoldListingsRobust } from '@/lib/ebay-scraper-robust';

// Rate limiting: 5 zippos per minute = 12 seconds between each
const BATCH_DELAY_MS = 12000;
const MAX_ZIPPOS_PER_RUN = 50; // Safety limit per cron run

// CRON_SECRET must be set in environment variables
const CRON_SECRET = process.env.CRON_SECRET;

interface Zippo {
  id: number;
  search_term: string;
  avg_price: number | null;
}

async function updateZippoPrice(
  supabase: SupabaseClient,
  zippo: Zippo
): Promise<boolean> {
  if (!zippo.search_term) {
    console.log(`[Cron] Skipping zippo ${zippo.id} - no search term`);
    return false;
  }

  console.log(`[Cron] Updating zippo ${zippo.id}: "${zippo.search_term}"`);

  const result = await scrapeEbaySoldListingsRobust(
    zippo.search_term,
    zippo.avg_price || undefined
  );

  if (!result.success || !result.data) {
    console.log(`[Cron] Failed to fetch price for zippo ${zippo.id}:`, result.error);
    return false;
  }

  // Update zippo with new prices
  const { error: updateError } = await supabase
    .from('zippos')
    .update({
      avg_price: result.data.avgPrice,
      min_price: result.data.minPrice,
      max_price: result.data.maxPrice,
      num_sold: result.data.numSold,
      last_fetched: new Date().toISOString(),
    })
    .eq('id', zippo.id);

  if (updateError) {
    console.log(`[Cron] Error updating zippo ${zippo.id}:`, updateError);
    return false;
  }

  // Save to price_snapshots
  await supabase.from('price_snapshots').insert({
    zippo_id: zippo.id,
    avg_price: result.data.avgPrice,
    min_price: result.data.minPrice,
    max_price: result.data.maxPrice,
    num_sold: result.data.numSold,
    source: 'cron',
  });

  // Save to price_history
  await supabase.from('price_history').insert({
    zippo_id: zippo.id,
    avg_price: result.data.avgPrice,
    min_price: result.data.minPrice,
    max_price: result.data.maxPrice,
    num_sold: result.data.numSold,
  });

  console.log(
    `[Cron] Updated zippo ${zippo.id}: €${result.data.avgPrice} (fallback: ${result.fallback})`
  );

  return true;
}

export async function GET(request: Request) {
  // Verify CRON_SECRET
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Initialize Supabase with service role (cron runs server-side)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseServiceKey) {
    console.error('[Cron] SUPABASE_SERVICE_ROLE_KEY not set');
    return new NextResponse('Server configuration error', { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('[Cron] Starting price update job...');

  // Get all zippos with search terms
  const { data: zippos, error } = await supabase
    .from('zippos')
    .select('id, search_term, avg_price')
    .not('search_term', 'is', null)
    .order('last_fetched', { ascending: true, nullsFirst: true }) // Oldest first
    .limit(MAX_ZIPPOS_PER_RUN);

  if (error) {
    console.error('[Cron] Error fetching zippos:', error);
    return new NextResponse('Database error', { status: 500 });
  }

  if (!zippos || zippos.length === 0) {
    console.log('[Cron] No zippos to update');
    return NextResponse.json({ message: 'No zippos to update', updated: 0 });
  }

  console.log(`[Cron] Found ${zippos.length} zippos to update`);

  let updated = 0;
  let failed = 0;

  // Process in batches with rate limiting
  for (let i = 0; i < zippos.length; i++) {
    const zippo = zippos[i];
    
    const success = await updateZippoPrice(supabase, zippo);
    
    if (success) {
      updated++;
    } else {
      failed++;
    }

    // Rate limiting: wait between zippos (except for the last one)
    if (i < zippos.length - 1) {
      console.log(`[Cron] Waiting ${BATCH_DELAY_MS / 1000}s before next zippo...`);
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  console.log(`[Cron] Completed: ${updated} updated, ${failed} failed`);

  return NextResponse.json({
    message: 'Price update completed',
    updated,
    failed,
    total: zippos.length,
  });
}

// Also support POST
export async function POST() {
  return GET(new Request('http://localhost', { method: 'GET' }));
}
