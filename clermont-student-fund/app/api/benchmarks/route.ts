import { NextResponse } from 'next/server';
import historyData from '@/data/history.json';
import portfolioData from '@/data/portfolio.json';
import { ChartPoint } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const history = historyData.history;
    const portfolioBase = history[0]?.value ?? 92600;

    // Build chart points from portfolio history only
    // (benchmark historical data not available without authenticated API)
    const chartPoints: ChartPoint[] = history.map((h) => ({
      date: h.date,
      portfolio: (h.value / portfolioBase) * 100,
      msciWorld: null,
      nasdaq100: null,
    }));

    return NextResponse.json({ chartPoints });
  } catch (error) {
    console.error('Benchmarks API error:', error);
    return NextResponse.json({ chartPoints: [] });
  }
}
