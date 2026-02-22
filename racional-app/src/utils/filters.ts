import type { EvolutionEntry, TimeRange } from '../types/investment.types';

export function filterByTimeRange(
  data: EvolutionEntry[],
  range: TimeRange,
): EvolutionEntry[] {
  if (range === 'ALL' || data.length === 0) return data;

  const lastDate = new Date(data[data.length - 1].date);
  let cutoff: Date;

  switch (range) {
    case '1M':
      cutoff = new Date(lastDate);
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    case '3M':
      cutoff = new Date(lastDate);
      cutoff.setMonth(cutoff.getMonth() - 3);
      break;
    case '6M':
      cutoff = new Date(lastDate);
      cutoff.setMonth(cutoff.getMonth() - 6);
      break;
    case '1Y':
      cutoff = new Date(lastDate);
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      break;
    case 'YTD':
      cutoff = new Date(lastDate.getFullYear(), 0, 1);
      break;
  }

  return data.filter((entry) => entry.date >= cutoff.toISOString().split('T')[0]);
}
