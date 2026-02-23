import { Avatar, LogoIcon } from "../../atoms";
import { LiveIndicator } from "../../molecules";
import { formatTimestamp } from "../../../utils/formatters";

interface DashboardHeaderProps {
  lastUpdated: Date | null;
}

export function DashboardHeader({ lastUpdated }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <LogoIcon className="h-8 w-8 text-[#0dc299]" />
        <h1
          className="text-2xl font-bold tracking-tight text-white"
          style={{
            fontFamily: '"Rozha One", Georgia, serif',
          }}
        >
          Racional
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Última sincronización: {formatTimestamp(lastUpdated)}
          </span>
        )}
        <LiveIndicator />
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-400">Portafolio de Isabel</p>
          <Avatar initials="I" size="sm" />
        </div>
      </div>
    </header>
  );
}
