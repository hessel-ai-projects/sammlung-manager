export interface PriceStats {
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  numSold: number;
}

export async function scrapeEbaySoldListings(searchTerm: string): Promise<PriceStats> {
  const empty: PriceStats = { avgPrice: 0, minPrice: 0, maxPrice: 0, numSold: 0 };

  try {
    const encodedTerm = encodeURIComponent(searchTerm);
    // eBay.de sold listings, sorted by most recent
    const url = `https://www.ebay.de/sch/i.html?_nkw=${encodedTerm}&LH_Sold=1&LH_Complete=1&_sop=13&LH_ItemCondition=3`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.5',
        'Accept-Encoding': 'identity',
      },
    });

    if (!response.ok) return empty;

    const html = await response.text();

    // eBay.de uses "EUR X,XX" format in the page
    // Extract all EUR prices from sold listings
    // We look for price patterns that appear in the results section
    const priceRegex = /EUR\s+([\d.]+,\d{2})/g;
    const allPrices: number[] = [];
    let match;

    while ((match = priceRegex.exec(html)) !== null) {
      // Convert German format: "1.234,56" -> 1234.56
      const priceStr = match[1].replace(/\./g, '').replace(',', '.');
      const price = parseFloat(priceStr);
      if (price > 0 && price < 10000) {
        allPrices.push(price);
      }
    }

    // eBay pages show prices for items + shipping, filter/deduplicate
    // Typically the first ~20-40 prices are item prices (interleaved with shipping)
    // We take unique-ish prices and remove very small ones (likely shipping)
    const itemPrices = allPrices.filter(p => p >= 3); // Exclude shipping costs under €3

    if (itemPrices.length === 0) return empty;

    // Take first half of prices (item prices tend to come before shipping/sidebar prices)
    const relevantPrices = itemPrices.slice(0, Math.min(itemPrices.length, 20));

    const avgPrice = relevantPrices.reduce((sum, p) => sum + p, 0) / relevantPrices.length;
    const minPrice = Math.min(...relevantPrices);
    const maxPrice = Math.max(...relevantPrices);

    return {
      avgPrice: Math.round(avgPrice * 100) / 100,
      minPrice: Math.round(minPrice * 100) / 100,
      maxPrice: Math.round(maxPrice * 100) / 100,
      numSold: relevantPrices.length,
    };
  } catch (error) {
    console.error('eBay scrape error:', error);
    return empty;
  }
}
