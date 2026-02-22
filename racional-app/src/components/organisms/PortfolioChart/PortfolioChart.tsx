import { useMemo, useRef, useCallback } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import type { ChartOptions, TooltipItem } from "chart.js";
import { Card, Badge, ResetZoomIcon } from "../../atoms";
import type { Currency, EvolutionEntry } from "../../../types/investment.types";
import {
  formatShortDate,
  formatCurrency,
  formatAbbreviatedCurrency,
  formatFullDate,
  formatDateRange,
} from "../../../utils/formatters";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  zoomPlugin,
);

const BRAND_GREEN = "#0dc299";
const BRAND_RED = "#c6443d";
const CONTRIBUTIONS_COLOR = "#ffad28";

interface PortfolioChartProps {
  data: EvolutionEntry[];
  currency: Currency;
}

export function PortfolioChart({ data, currency }: PortfolioChartProps) {
  const chartRef = useRef<ChartJS<"line">>(null);

  const isPositiveTrend =
    data.length >= 2 && data[data.length - 1].value >= data[0].value;
  const accentColor = isPositiveTrend ? BRAND_GREEN : BRAND_RED;

  const handleResetZoom = useCallback(() => {
    chartRef.current?.resetZoom();
  }, []);

  const chartData = useMemo(
    () => ({
      labels: data.map((e) => formatShortDate(e.date)),
      datasets: [
        {
          label: "Valor del portafolio",
          data: data.map((e) => e.value),
          borderColor: accentColor,
          borderWidth: 2,
          pointRadius: 0,
          pointBackgroundColor: accentColor,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: accentColor,
          pointHoverBorderColor: "#0f1219",
          pointHoverBorderWidth: 2,
          fill: true,
          backgroundColor: (ctx: { chart: ChartJS }) => {
            const { chart } = ctx;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return "transparent";
            const gradient = canvasCtx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(
              0,
              isPositiveTrend
                ? "rgba(13, 194, 153, 0.18)"
                : "rgba(198, 68, 61, 0.18)",
            );
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            return gradient;
          },
          tension: 0.4,
          order: 1,
        },
        {
          label: "Aportes",
          data: data.map((e) => e.contributions),
          borderColor: CONTRIBUTIONS_COLOR,
          borderWidth: 1.5,
          borderDash: [6, 4],
          pointRadius: 0,
          pointBackgroundColor: CONTRIBUTIONS_COLOR,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: CONTRIBUTIONS_COLOR,
          pointHoverBorderColor: "#0f1219",
          pointHoverBorderWidth: 2,
          fill: false,
          tension: 0.4,
          order: 2,
        },
      ],
    }),
    [data, accentColor, isPositiveTrend],
  );

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600,
        easing: "easeInOutQuart",
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: "#6b7280",
            font: { size: 11 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
          },
        },
        y: {
          grid: { color: "rgba(255, 255, 255, 0.04)" },
          border: { display: false },
          ticks: {
            color: "#6b7280",
            font: { size: 11 },
            callback: (value: string | number) =>
              formatAbbreviatedCurrency(Number(value), currency),
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: "#9ca3af",
            font: { size: 11 },
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            padding: 20,
            generateLabels(chart) {
              const plugin = ChartJS.registry.getPlugin("legend");
              const defaultGen = plugin?.defaults?.labels?.generateLabels;
              const defaultItems = defaultGen
                ? defaultGen.call(chart.legend, chart)
                : chart.data.datasets.map((ds, i) => ({
                    text: ds.label ?? "",
                    fillStyle: "#9ca3af",
                    strokeStyle: "#9ca3af",
                    fontColor: "#9ca3af",
                    hidden: !chart.isDatasetVisible(i),
                    index: i,
                    datasetIndex: i,
                  }));
              return defaultItems.map((item: { datasetIndex: number; text?: string; [key: string]: unknown }) => {
                const ds = chart.data.datasets[item.datasetIndex];
                const color =
                  typeof ds?.borderColor === "string" ? ds.borderColor : "#9ca3af";
                return {
                  ...item,
                  fillStyle: color,
                  strokeStyle: color,
                  lineWidth: 0,
                };
              });
            },
          },
        },
        tooltip: {
          backgroundColor: "#1e2a3d",
          titleColor: "#9ca3af",
          bodyColor: "#f9fafb",
          titleFont: { size: 12, weight: "normal" as const },
          bodyFont: { size: 13, weight: "bold" as const },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            title: (items: TooltipItem<"line">[]) => {
              const idx = items[0]?.dataIndex;
              if (idx === undefined || !data[idx]) return "";
              return formatFullDate(data[idx].date);
            },
            label: (item: TooltipItem<"line">) => {
              const label = item.dataset.label ?? "";
              const value = formatCurrency(item.parsed.y ?? 0, currency);
              return ` ${label}: ${value}`;
            },
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
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
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Evolución del portafolio
          </h2>
          {dateRange && <p className="text-xs text-gray-500">{dateRange}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetZoom}
            className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/[0.1] hover:text-white"
            title="Restablecer zoom"
          >
            <ResetZoomIcon className="h-3.5 w-3.5" />
            Reset zoom
          </button>
          <Badge variant={isPositiveTrend ? "green" : "red"}>
            {isPositiveTrend ? "Tendencia positiva" : "Tendencia negativa"}
          </Badge>
        </div>
      </div>
      <div className="h-[400px] w-full">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </Card>
  );
}
