import { useMemo } from 'react';
import { TrendIcon, DailyChangeIcon, ArrowUpIcon, ArrowDownIcon } from '../../atoms';
import { MetricCard } from '../../molecules';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';
import type { Currency, EvolutionEntry } from '../../../types/investment.types';

interface MetricsGridProps {
  data: EvolutionEntry[];
  currency: Currency;
}

export function MetricsGrid({ data, currency }: MetricsGridProps) {
  const metrics = useMemo(() => {
    if (data.length === 0) return null;

    const latest = data[data.length - 1].value;
    const previous = data.length >= 2 ? data[data.length - 2].value : latest;
    const dailyChange = latest - previous;
    const dailyChangePct = previous !== 0 ? (dailyChange / previous) * 100 : 0;
    const maxValue = Math.max(...data.map((e) => e.value));
    const minValue = Math.min(...data.map((e) => e.value));

    return {
      totalValue: formatCurrency(latest, currency),
      dailyChange: {
        amount: formatCurrency(Math.abs(dailyChange), currency),
        percentage: formatPercentage(dailyChangePct),
        isPositive: dailyChange >= 0,
      },
      maxValue: formatCurrency(maxValue, currency),
      minValue: formatCurrency(minValue, currency),
    };
  }, [data, currency]);

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Valor Total"
        value={metrics.totalValue}
        icon={<TrendIcon />}
      />
      <MetricCard
        label="Variación del día"
        value={
          metrics.dailyChange.isPositive
            ? `+${metrics.dailyChange.amount}`
            : `-${metrics.dailyChange.amount}`
        }
        change={metrics.dailyChange}
        icon={<DailyChangeIcon />}
      />
      <MetricCard
        label="Valor Máximo"
        value={metrics.maxValue}
        icon={<ArrowUpIcon />}
      />
      <MetricCard
        label="Valor Mínimo"
        value={metrics.minValue}
        icon={<ArrowDownIcon />}
      />
    </div>
  );
}
