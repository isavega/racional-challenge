import type { Currency } from '../types/investment.types';

const CLP_FORMATTER = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number, currency: Currency): string {
  return currency === 'CLP'
    ? CLP_FORMATTER.format(value)
    : USD_FORMATTER.format(value);
}

export function formatAbbreviatedCurrency(value: number, currency: Currency): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  const symbol = currency === 'CLP' ? '$' : '$';

  if (abs >= 1_000_000_000) {
    const num = abs / 1_000_000_000;
    return `${sign}${symbol}${formatAbbrevNumber(num, currency)}B`;
  }
  if (abs >= 1_000_000) {
    const num = abs / 1_000_000;
    return `${sign}${symbol}${formatAbbrevNumber(num, currency)}M`;
  }
  if (abs >= 1_000) {
    const num = abs / 1_000;
    return `${sign}${symbol}${formatAbbrevNumber(num, currency)}K`;
  }
  return formatCurrency(value, currency);
}

function formatAbbrevNumber(num: number, currency: Currency): string {
  const locale = currency === 'CLP' ? 'es-CL' : 'en-US';
  return num.toLocaleString(locale, {
    minimumFractionDigits: num % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

const MONTH_NAMES_ES: Record<number, string> = {
  0: 'Ene', 1: 'Feb', 2: 'Mar', 3: 'Abr', 4: 'May', 5: 'Jun',
  6: 'Jul', 7: 'Ago', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dic',
};

export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const d = date.getDate();
  const m = MONTH_NAMES_ES[date.getMonth()];
  return `${d} ${m}`;
}

export function formatFullDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const MONTH_NAMES_FULL_ES: Record<number, string> = {
  0: 'Ene', 1: 'Feb', 2: 'Mar', 3: 'Abr', 4: 'May', 5: 'Jun',
  6: 'Jul', 7: 'Ago', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dic',
};

export function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split('-').map(Number);
  return `${MONTH_NAMES_FULL_ES[month - 1]} ${year}`;
}

export function formatDateRange(firstDate: string, lastDate: string): string {
  return `${formatMonthYear(firstDate)} — ${formatMonthYear(lastDate)}`;
}
