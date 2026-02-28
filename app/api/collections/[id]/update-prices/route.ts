import { getZipposByCollection } from "@/lib/zippos";
import { scrapeEbaySoldListings } from "@/lib/ebay-scraper";
import { savePriceSnapshot } from "@/lib/prices";
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const zippos = await getZipposByCollection(Number(id));

  const results = [];
  for (const z of zippos) {
    if (!z.search_term) continue;
    try {
      const stats = await scrapeEbaySoldListings(z.search_term);
      if (stats.numSold > 0) {
        await savePriceSnapshot({
          zippo_id: z.id,
          avg_price: stats.avgPrice,
          min_price: stats.minPrice,
          max_price: stats.maxPrice,
          num_sold: stats.numSold,
        });
        results.push({ zippo: z.name, ...stats });
      }
    } catch (e) {
      console.error(`Failed for ${z.name}:`, e);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  return NextResponse.json({ updated: results.length, results });
}
