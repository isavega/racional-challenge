import { EmptyChartIcon } from '../../atoms';

export function EmptyState() {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-[#162032] px-6 py-16">
      <EmptyChartIcon className="mb-4 h-12 w-12 text-gray-600" />
      <p className="mb-1 text-lg font-semibold text-white">
        Sin datos disponibles
      </p>
      <p className="text-sm text-gray-400">
        Aún no hay evolución de inversiones registrada.
      </p>
    </div>
  );
}
