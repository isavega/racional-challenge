import { PulseDot } from '../../atoms';

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[#0dc299]/10 px-3 py-1.5">
      <PulseDot color="green" size="md" />
      <span className="text-xs font-medium text-[#65d6b0]">En vivo</span>
    </div>
  );
}
