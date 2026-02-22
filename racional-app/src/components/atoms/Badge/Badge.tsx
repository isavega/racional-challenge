interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'neutral';
}

const VARIANT_MAP = {
  green: 'bg-[#0dc299]/10 text-[#65d6b0]',
  red: 'bg-[#c6443d]/10 text-[#c6443d]',
  neutral: 'bg-white/[0.06] text-gray-400',
};

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${VARIANT_MAP[variant]}`}
    >
      {children}
    </span>
  );
}
