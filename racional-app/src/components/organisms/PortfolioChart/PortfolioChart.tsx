import { useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import type { ChartOptions, TooltipItem } from 'chart.js';
import { Card, Badge } from '../../atoms';
import type { Currency, EvolutionEntry } from '../../../types/investment.types';
import {
  formatShortDate,
  formatCurrency,
  formatAbbreviatedCurrency,
  formatFullDate,
  formatDateRange,
} from '../../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

const BRAND_GREEN = '#0dc299';
const BRAND_RED = '#c6443d';

interface PortfolioChartProps {
  data: EvolutionEntry[];
  currency: Currency;
}

export function PortfolioChart({ data, currency }: PortfolioChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const isPositiveTrend =
    data.length >= 2 && data[data.length - 1].value >= data[0].value;
  const accentColor = isPositiveTrend ? BRAND_GREEN : BRAND_RED;

  const chartData = useMemo(
    () => ({
      labels: data.map((e) => formatShortDate(e.date)),
      datasets: [
        {
          data: data.map((e) => e.value),
          borderColor: accentColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: accentColor,
          pointHoverBorderColor: '#0f1219',
          pointHoverBorderWidth: 2,
          fill: true,
          backgroundColor: (ctx: { chart: ChartJS }) => {
            const { chart } = ctx;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return 'transparent';
            const gradient = canvasCtx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(
              0,
              isPositiveTrend
                ? 'rgba(13, 194, 153, 0.18)'
                : 'rgba(198, 68, 61, 0.18)',
            );
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            return gradient;
          },
          tension: 0.4,
        },
      ],
    }),
    [data, accentColor, isPositiveTrend],
  );

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600,
        easing: 'easeInOutQuart',
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#6b7280',
            font: { size: 11 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
          },
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          border: { display: false },
          ticks: {
            color: '#6b7280',
            font: { size: 11 },
            callback: (value: string | number) =>
              formatAbbreviatedCurrency(Number(value), currency),
          },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: '#1e2a3d',
          titleColor: '#9ca3af',
          bodyColor: '#f9fafb',
          titleFont: { size: 12, weight: 'normal' as const },
          bodyFont: { size: 14, weight: 'bold' as const },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (items: TooltipItem<'line'>[]) => {
              const idx = items[0]?.dataIndex;
              if (idx === undefined || !data[idx]) return '';
              return formatFullDate(data[idx].date);
            },
            label: (item: TooltipItem<'line'>) =>
              formatCurrency(item.parsed.y ?? 0, currency),
          },
        },
      },
    }),
    [currency, data],
  );

  const dateRange =
    data.length >= 2
      ? formatDateRange(data[0].date, data[data.length - 1].date)
      : null;

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Evolución del portafolio
          </h2>
          {dateRange && (
            <p className="text-xs text-gray-500">{dateRange}</p>
          )}
        </div>
        <Badge variant={isPositiveTrend ? 'green' : 'red'}>
          {isPositiveTrend ? 'Tendencia positiva' : 'Tendencia negativa'}
        </Badge>
      </div>
      <div className="h-[380px] w-full">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </Card>
  );
}
