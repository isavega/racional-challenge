import { useCallback } from 'react';
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
} from '../../molecules';

export function DashboardPage() {
  const { data, currency, loading, error, lastUpdated } =
    useInvestmentEvolution();

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

  if (!data || data.length === 0) {
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
      <MetricsGrid data={data} currency={currency} />
      <PortfolioChart data={data} currency={currency} />
    </DashboardLayout>
  );
}
