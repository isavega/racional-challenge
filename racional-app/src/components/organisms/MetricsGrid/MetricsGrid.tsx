import { useMemo } from 'react';
import {
  TrendIcon,
  DailyChangeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ReturnIcon,
  PercentIcon,
  IndexIcon,
  VolatilityIcon,
} from '../../atoms';
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

    const first = data[0];
    const latest = data[data.length - 1];
    const previous = data.length >= 2 ? data[data.length - 2] : latest;

    const dailyChange = latest.value - previous.value;
    const dailyChangePct =
      previous.value !== 0 ? (dailyChange / previous.value) * 100 : 0;
    const maxValue = Math.max(...data.map((e) => e.value));
    const minValue = Math.min(...data.map((e) => e.value));

    const totalReturn = latest.value - latest.contributions;
    const cumulativeReturnPct =
      first.contributions !== 0
        ? ((latest.value - first.contributions) / first.contributions) * 100
        : 0;

    const dailyReturns = data.map((e) => e.dailyReturn);
    const meanReturn =
      dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
    const variance =
      dailyReturns.reduce((sum, r) => sum + (r - meanReturn) ** 2, 0) /
      dailyReturns.length;
    const annualizedVolatility = Math.sqrt(variance) * Math.sqrt(252) * 100;

    return {
      totalValue: formatCurrency(latest.value, currency),
      dailyChange: {
        amount: formatCurrency(Math.abs(dailyChange), currency),
        percentage: formatPercentage(dailyChangePct),
        isPositive: dailyChange >= 0,
      },
      maxValue: formatCurrency(maxValue, currency),
      minValue: formatCurrency(minValue, currency),
      totalReturn: {
        formatted: formatCurrency(Math.abs(totalReturn), currency),
        isPositive: totalReturn >= 0,
        change: {
          amount: formatCurrency(Math.abs(totalReturn), currency),
          percentage: formatPercentage(
            latest.contributions !== 0
              ? (totalReturn / latest.contributions) * 100
              : 0,
          ),
          isPositive: totalReturn >= 0,
        },
      },
      cumulativeReturnPct: formatPercentage(cumulativeReturnPct),
      cumulativeIsPositive: cumulativeReturnPct >= 0,
      portfolioIndex: latest.portfolioIndex.toFixed(2),
      indexChange: {
        amount: (latest.portfolioIndex - first.portfolioIndex).toFixed(2),
        percentage: formatPercentage(
          ((latest.portfolioIndex - first.portfolioIndex) /
            first.portfolioIndex) *
            100,
        ),
        isPositive: latest.portfolioIndex >= first.portfolioIndex,
      },
      volatility: `${annualizedVolatility.toFixed(2)}%`,
    };
  }, [data, currency]);

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      <MetricCard
        label="Valor Total"
        value={metrics.totalValue}
        icon={<TrendIcon />}
        tooltip="Cuánto vale tu portafolio hoy. Es el precio de mercado de todas tus inversiones sumadas."
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
        tooltip="Cuánto subió o bajó tu portafolio respecto al día anterior. Verde es ganancia, rojo es pérdida."
      />
      <MetricCard
        label="Retorno Total"
        value={
          metrics.totalReturn.isPositive
            ? `+${metrics.totalReturn.formatted}`
            : `-${metrics.totalReturn.formatted}`
        }
        change={metrics.totalReturn.change}
        icon={<ReturnIcon />}
        tooltip="La diferencia entre lo que vale tu portafolio hoy y lo que has depositado en total. Es tu ganancia o pérdida real en pesos."
      />
      <MetricCard
        label="Rentabilidad Acumulada"
        value={metrics.cumulativeReturnPct}
        icon={<PercentIcon />}
        tooltip="El porcentaje que has ganado (o perdido) sobre tu inversión inicial. Por ejemplo, +10% significa que por cada $100 invertidos, ahora tienes $110."
      />
      <MetricCard
        label="Valor Máximo"
        value={metrics.maxValue}
        icon={<ArrowUpIcon />}
        tooltip="El valor más alto que ha alcanzado tu portafolio en el período seleccionado."
      />
      <MetricCard
        label="Valor Mínimo"
        value={metrics.minValue}
        icon={<ArrowDownIcon />}
        tooltip="El valor más bajo que ha tenido tu portafolio en el período seleccionado."
      />
      <MetricCard
        label="Índice del Portafolio"
        value={metrics.portfolioIndex}
        change={metrics.indexChange}
        icon={<IndexIcon />}
        tooltip="Mide el rendimiento de tu portafolio partiendo de base 100. Si hoy marca 120, significa que tu inversión ha crecido un 20% desde el inicio."
      />
      <MetricCard
        label="Volatilidad Anualizada"
        value={metrics.volatility}
        icon={<VolatilityIcon />}
        tooltip="Mide cuánto fluctúa tu portafolio. Un número bajo (ej: 5%) significa que es estable; uno alto (ej: 30%) significa que sube y baja mucho. Se calcula proyectando las variaciones diarias a un año."
      />
    </div>
  );
}
