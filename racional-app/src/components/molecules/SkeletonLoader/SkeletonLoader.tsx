import { SkeletonBlock } from '../../atoms';

export function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-[120px]" />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return <SkeletonBlock className="h-[400px]" />;
}

export function SkeletonHeader() {
  return (
    <div className="flex items-center justify-between">
      <SkeletonBlock className="h-8 w-40" />
      <SkeletonBlock className="h-7 w-24" />
    </div>
  );
}
