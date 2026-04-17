export interface HistoricalBar {
  date: string; // YYYY-MM-DD
  close: number;
}

/**
 * Fetches weekly historical OHLCV data from Yahoo Finance v8 API.
 * Cached for 1 hour via Next.js fetch cache.
 */
export async function fetchHistoricalPrices(
  ticker: string,
  period1: number,
  period2: number,
  interval = '1wk'
): Promise<HistoricalBar[]> {
  const encoded = encodeURIComponent(ticker);
  const hosts = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];

  for (const host of hosts) {
    try {
      const url = `https://${host}/v8/finance/chart/${encoded}?interval=${interval}&period1=${period1}&period2=${period2}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'application/json',
          Referer: 'https://finance.yahoo.com/',
        },
        signal: AbortSignal.timeout(12000),
        next: { revalidate: 3600 }, // cache 1h for historical data
      });
      if (!res.ok) continue;
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result) continue;

      const timestamps: number[] = result.timestamp ?? [];
      const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];

      const bars: HistoricalBar[] = [];
      for (let i = 0; i < timestamps.length; i++) {
        const close = closes[i];
        if (close != null && close > 0) {
          const date = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
          bars.push({ date, close });
        }
      }
      return bars;
    } catch {
      continue;
    }
  }
  return [];
}

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
        cache: 'no-store', // always fetch fresh prices, never use Next.js cache
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
