interface ChangeIndicatorProps {
  amount: string;
  percentage: string;
  isPositive: boolean;
}

export function ChangeIndicator({ amount, percentage, isPositive }: ChangeIndicatorProps) {
  return (
    <div className="mt-2 flex items-center gap-2">
      <span
        className={`flex items-center gap-0.5 text-sm font-medium ${
          isPositive ? 'text-[#0dc299]' : 'text-[#c6443d]'
        }`}
      >
        <svg
          className={`h-3.5 w-3.5 ${isPositive ? '' : 'rotate-180'}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M6 2.5V9.5M6 2.5L9.5 6M6 2.5L2.5 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {amount}
      </span>
      <span
        className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${
          isPositive
            ? 'bg-[#0dc299]/10 text-[#0dc299]'
            : 'bg-[#c6443d]/10 text-[#c6443d]'
        }`}
      >
        {percentage}
      </span>
    </div>
  );
}
