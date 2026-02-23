interface AvatarProps {
  /** Initial(s) to show (e.g. "I" for Isabel) */
  initials: string;
  /** Size: sm (32px), md (40px), lg (48px) */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
};

export function Avatar({
  initials,
  size = "md",
  className = "",
}: AvatarProps) {
  const display = initials.slice(0, 2).toUpperCase();
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#0dc299]/20 text-[#0dc299] font-semibold ${sizeClasses[size]} ${className}`}
      title="Isabel"
      aria-hidden
    >
      {display}
    </div>
  );
}
