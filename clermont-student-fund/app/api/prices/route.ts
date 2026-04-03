import { NextResponse } from 'next/server';
import { fetchPrices } from '@/lib/fetchPrice';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickersParam = searchParams.get('tickers');

  if (!tickersParam) {
    return NextResponse.json({ error: 'tickers parameter required' }, { status: 400 });
  }

  const tickers = tickersParam.split(',').filter(Boolean);

  try {
    const prices = await fetchPrices(tickers);
    return NextResponse.json({ prices });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
