interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'primary';
  children: React.ReactNode;
}

const VARIANT_MAP = {
  ghost: 'bg-white/10 text-white hover:bg-white/20',
  primary: 'bg-[#0dc299] text-[#18273a] font-medium hover:bg-[#18daae]',
};

export function Button({ variant = 'ghost', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${VARIANT_MAP[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
