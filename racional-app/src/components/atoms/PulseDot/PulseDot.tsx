interface PulseDotProps {
  color?: 'green' | 'red';
  size?: 'sm' | 'md';
}

const COLOR_MAP = {
  green: { ring: 'bg-[#65d6b0]', dot: 'bg-[#0dc299]' },
  red: { ring: 'bg-[#c6443d]/70', dot: 'bg-[#c6443d]' },
};

const SIZE_MAP = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
};

export function PulseDot({ color = 'green', size = 'md' }: PulseDotProps) {
  const { ring, dot } = COLOR_MAP[color];
  const sizeClass = SIZE_MAP[size];

  return (
    <span className={`relative flex ${sizeClass}`}>
      <span
        className={`absolute inline-flex h-full w-full animate-[pulse-ring_1.5s_ease-in-out_infinite] rounded-full ${ring} opacity-75`}
      />
      <span className={`relative inline-flex ${sizeClass} rounded-full ${dot}`} />
    </span>
  );
}
