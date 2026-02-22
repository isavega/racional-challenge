import { Card, ChangeIndicator, InfoTooltip } from '../../atoms';

interface MetricCardProps {
  label: string;
  value: string;
  change?: {
    amount: string;
    percentage: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  tooltip?: string;
}

export function MetricCard({ label, value, change, icon, tooltip }: MetricCardProps) {
  return (
    <Card hoverable>
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
          {label}
          {tooltip && <InfoTooltip content={tooltip} />}
        </span>
        <span className="text-gray-500 transition-colors group-hover:text-[#0dc299]/60">
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-white">
        {value}
      </p>
      {change && (
        <ChangeIndicator
          amount={change.amount}
          percentage={change.percentage}
          isPositive={change.isPositive}
        />
      )}
    </Card>
  );
}
