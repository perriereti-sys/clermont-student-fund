import { HistoryPoint, EnrichedPosition, Alert } from './types';

export function getDailyReturns(history: HistoryPoint[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < history.length; i++) {
    returns.push((history[i].value - history[i - 1].value) / history[i - 1].value);
  }
  return returns;
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
  return Math.sqrt(variance);
}

export function computeSharpeRatio(
  history: HistoryPoint[],
  riskFreeRate = 0.035
): number {
  const returns = getDailyReturns(history);
  if (returns.length < 5) return 0;

  const annualReturn =
    (history[history.length - 1].value / history[0].value - 1) *
    (365 / Math.max(returns.length, 1));

  const annualVol = stdDev(returns) * Math.sqrt(252);
  if (annualVol === 0) return 0;

  return parseFloat(((annualReturn - riskFreeRate) / annualVol).toFixed(2));
}

export function computeMaxDrawdown(history: HistoryPoint[]): number {
  let maxDD = 0;
  let peak = history[0]?.value ?? 0;

  for (const point of history) {
    if (point.value > peak) peak = point.value;
    const dd = peak > 0 ? (peak - point.value) / peak : 0;
    if (dd > maxDD) maxDD = dd;
  }

  return parseFloat((maxDD * 100).toFixed(2));
}

export function computeVaR95(history: HistoryPoint[], portfolioValue: number): number {
  const returns = getDailyReturns(history);
  if (returns.length < 5) return 0;
  const vol = stdDev(returns);
  return parseFloat((portfolioValue * 1.645 * vol).toFixed(0));
}

export function computeBeta(
  portfolioReturns: number[],
  benchmarkReturns: number[]
): number {
  const n = Math.min(portfolioReturns.length, benchmarkReturns.length);
  if (n < 5) return 1;

  const pReturns = portfolioReturns.slice(-n);
  const bReturns = benchmarkReturns.slice(-n);

  const pMean = mean(pReturns);
  const bMean = mean(bReturns);

  let covariance = 0;
  let benchmarkVariance = 0;

  for (let i = 0; i < n; i++) {
    covariance += (pReturns[i] - pMean) * (bReturns[i] - bMean);
    benchmarkVariance += Math.pow(bReturns[i] - bMean, 2);
  }

  if (benchmarkVariance === 0) return 1;
  return parseFloat((covariance / benchmarkVariance).toFixed(2));
}

export function computeAlerts(
  positions: EnrichedPosition[],
  totalValue: number
): Alert[] {
  const alerts: Alert[] = [];

  // Limit 1: No single position > 15%
  for (const pos of positions) {
    if (pos.weight > 15) {
      alerts.push({
        type: pos.weight > 20 ? 'danger' : 'warning',
        message: `${pos.name} dépasse la limite de 15% par position`,
        value: pos.weight,
        limit: 15,
        ticker: pos.ticker,
      });
    }
  }

  // Limit 2: Crypto max 20%
  const cryptoWeight = positions
    .filter((p) => p.type === 'crypto')
    .reduce((sum, p) => sum + p.weight, 0);
  if (cryptoWeight > 20) {
    alerts.push({
      type: 'danger',
      message: `Exposition Crypto dépasse la limite de 20%`,
      value: cryptoWeight,
      limit: 20,
    });
  } else if (cryptoWeight > 16) {
    alerts.push({
      type: 'warning',
      message: `Exposition Crypto proche de la limite de 20%`,
      value: cryptoWeight,
      limit: 20,
    });
  }

  // Limit 3: No single sector > 25%
  const sectorWeights: Record<string, number> = {};
  for (const pos of positions) {
    sectorWeights[pos.sector] = (sectorWeights[pos.sector] ?? 0) + pos.weight;
  }
  for (const [sector, weight] of Object.entries(sectorWeights)) {
    if (weight > 25) {
      alerts.push({
        type: 'danger',
        message: `Secteur "${sector}" dépasse la limite de 25%`,
        value: weight,
        limit: 25,
      });
    } else if (weight > 20) {
      alerts.push({
        type: 'warning',
        message: `Secteur "${sector}" proche de la limite de 25%`,
        value: weight,
        limit: 25,
      });
    }
  }

  return alerts;
}

export function normalizeToBase100(
  points: { date: string; value: number }[],
  startDate: string
): { date: string; value: number }[] {
  const startPoint = points.find((p) => p.date >= startDate);
  if (!startPoint) return points;
  const base = startPoint.value;
  return points.map((p) => ({ date: p.date, value: (p.value / base) * 100 }));
}
