interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return (
    <div
      className={`animate-[shimmer_1.5s_ease-in-out_infinite] rounded-xl bg-gradient-to-r from-white/[0.03] via-white/[0.08] via-50% to-white/[0.03] bg-[length:200%_100%] ${className}`}
    />
  );
}
