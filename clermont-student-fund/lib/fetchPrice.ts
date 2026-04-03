/**
 * Fetches the current price of a ticker from Yahoo Finance v8 API.
 * Uses the chart endpoint which does NOT require a crumb/cookie.
 */
export async function fetchPrice(ticker: string): Promise<number | null> {
  const encoded = encodeURIComponent(ticker);
  const hosts = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];

  for (const host of hosts) {
    try {
      const url = `https://${host}/v8/finance/chart/${encoded}?interval=1d&range=1d`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'application/json',
          Referer: 'https://finance.yahoo.com/',
        },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const price: number | undefined =
        data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (price && price > 0) return price;
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Fetches prices for multiple tickers in parallel.
 * Returns a map of ticker -> price (null if unavailable).
 */
export async function fetchPrices(
  tickers: string[]
): Promise<Record<string, number | null>> {
  const results = await Promise.allSettled(
    tickers.map((t) => fetchPrice(t))
  );
  const map: Record<string, number | null> = {};
  results.forEach((r, i) => {
    map[tickers[i]] = r.status === 'fulfilled' ? r.value : null;
  });
  return map;
}
