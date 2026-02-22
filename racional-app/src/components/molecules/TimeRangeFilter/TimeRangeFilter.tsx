import type { TimeRange } from '../../../types/investment.types';

interface TimeRangeFilterProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

const RANGES: { value: TimeRange; label: string }[] = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1A' },
  { value: 'YTD', label: 'YTD' },
  { value: 'ALL', label: 'Todo' },
];

export function TimeRangeFilter({ selected, onChange }: TimeRangeFilterProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1">
      {RANGES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            selected === value
              ? 'bg-[#0dc299] text-[#0f1219] shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
