export interface PriceStats {
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  numSold: number;
}

export interface ScrapeResult {
  success: boolean;
  data?: PriceStats;
  error?: string;
  fallback?: boolean;
}

// User-Agent Rotation - diverse User-Agents für besseres Scraping
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Exponential Backoff: 1s, 2s, 4s (baseDelay * 2^attempt)
function getDelay(attempt: number, baseDelay: number = 1000): number {
  return baseDelay * Math.pow(2, attempt);
}

function parseGermanPrice(priceStr: string): number {
  // Convert German format: "1.234,56" -> 1234.56
  return parseFloat(priceStr.replace(/\./g, '').replace(',', '.'));
}

export async function scrapeEbaySoldListingsRobust(
  searchTerm: string,
  lastKnownPrice?: number
): Promise<ScrapeResult> {
  const maxRetries = 3;
  const timeoutMs = 15000; // 15s timeout

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const userAgent = getRandomUserAgent();
    const delay = getDelay(attempt);
    
    console.log(`[eBay Scraper] Attempt ${attempt + 1}/${maxRetries} for "${searchTerm}" (delay: ${delay}ms)`);

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const encodedTerm = encodeURIComponent(searchTerm);
      const url = `https://www.ebay.de/sch/i.html?_nkw=${encodedTerm}&LH_Sold=1&LH_Complete=1&_sop=13&LH_ItemCondition=3`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'de-DE,de;q=0.9,en;q=0.5',
          'Accept-Encoding': 'identity',
          'Connection': 'keep-alive',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log(`[eBay Scraper] Response not OK: ${response.status}`);
        if (attempt < maxRetries - 1) {
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        // Fallback to last known price if available
        if (lastKnownPrice !== undefined) {
          return {
            success: true,
            data: { avgPrice: lastKnownPrice, minPrice: lastKnownPrice, maxPrice: lastKnownPrice, numSold: 0 },
            fallback: true,
          };
        }
        return { success: false, error: `HTTP ${response.status}` };
      }

      const html = await response.text();

      // Parse prices
      const priceRegex = /EUR\s+([\d.]+,\d{2})/g;
      const allPrices: number[] = [];
      let match;

      while ((match = priceRegex.exec(html)) !== null) {
        const price = parseGermanPrice(match[1]);
        if (price > 0 && price < 10000) {
          allPrices.push(price);
        }
      }

      // Filter out shipping costs (typically very small)
      const itemPrices = allPrices.filter(p => p >= 3);

      if (itemPrices.length === 0) {
        console.log(`[eBay Scraper] No prices found for "${searchTerm}"`);
        // Fallback to last known price
        if (lastKnownPrice !== undefined) {
          return {
            success: true,
            data: { avgPrice: lastKnownPrice, minPrice: lastKnownPrice, maxPrice: lastKnownPrice, numSold: 0 },
            fallback: true,
          };
        }
        return { success: false, error: 'No prices found' };
      }

      // Take first 20 prices (item prices)
      const relevantPrices = itemPrices.slice(0, Math.min(itemPrices.length, 20));

      const avgPrice = relevantPrices.reduce((sum, p) => sum + p, 0) / relevantPrices.length;
      const minPrice = Math.min(...relevantPrices);
      const maxPrice = Math.max(...relevantPrices);

      console.log(`[eBay Scraper] Success: €${avgPrice.toFixed(2)} (${relevantPrices.length} items)`);

      return {
        success: true,
        data: {
          avgPrice: Math.round(avgPrice * 100) / 100,
          minPrice: Math.round(minPrice * 100) / 100,
          maxPrice: Math.round(maxPrice * 100) / 100,
          numSold: relevantPrices.length,
        },
      };

    } catch (error: any) {
      console.log(`[eBay Scraper] Error on attempt ${attempt + 1}:`, error.message);
      
      // Timeout or network error - retry with backoff
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      
      // Final fallback to last known price
      if (lastKnownPrice !== undefined) {
        return {
          success: true,
          data: { avgPrice: lastKnownPrice, minPrice: lastKnownPrice, maxPrice: lastKnownPrice, numSold: 0 },
          fallback: true,
        };
      }
      
      return { success: false, error: error.message };
    }
  }

  // Should not reach here, but safety fallback
  if (lastKnownPrice !== undefined) {
    return {
      success: true,
      data: { avgPrice: lastKnownPrice, minPrice: lastKnownPrice, maxPrice: lastKnownPrice, numSold: 0 },
      fallback: true,
    };
  }

  return { success: false, error: 'Max retries exceeded' };
}

// Wrapper for backwards compatibility with old function signature
export async function scrapeEbaySoldListings(searchTerm: string): Promise<PriceStats> {
  const result = await scrapeEbaySoldListingsRobust(searchTerm);
  return result.data || { avgPrice: 0, minPrice: 0, maxPrice: 0, numSold: 0 };
}
