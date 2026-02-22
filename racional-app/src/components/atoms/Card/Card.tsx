interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#162032] p-5 ${
        hoverable
          ? 'group transition-all duration-300 hover:border-[#0dc299]/25 hover:bg-[#1b2840]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
