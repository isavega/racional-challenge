import { useCallback, useMemo, useState } from 'react';
import { useInvestmentEvolution } from '../../../hooks/useInvestmentEvolution';
import { DashboardLayout } from '../../templates';
import {
  DashboardHeader,
  MetricsGrid,
  PortfolioChart,
  ErrorState,
  EmptyState,
} from '../../organisms';
import {
  SkeletonCards,
  SkeletonChart,
  SkeletonHeader,
  TimeRangeFilter,
} from '../../molecules';
import { filterByTimeRange } from '../../../utils/filters';
import type { TimeRange } from '../../../types/investment.types';

export function DashboardPage() {
  const { data, currency, loading, error, lastUpdated } =
    useInvestmentEvolution();

  const [timeRange, setTimeRange] = useState<TimeRange>('ALL');

  const filteredData = useMemo(
    () => (data ? filterByTimeRange(data, timeRange) : null),
    [data, timeRange],
  );

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <SkeletonHeader />
        <SkeletonCards />
        <SkeletonChart />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardHeader lastUpdated={lastUpdated} />
        <ErrorState message={error} onRetry={handleRetry} />
      </DashboardLayout>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <DashboardLayout>
        <DashboardHeader lastUpdated={lastUpdated} />
        <EmptyState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader lastUpdated={lastUpdated} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TimeRangeFilter selected={timeRange} onChange={setTimeRange} />
      </div>
      <MetricsGrid data={filteredData} currency={currency} />
      <PortfolioChart data={filteredData} currency={currency} />
    </DashboardLayout>
  );
}
