import { Trophy } from "lucide-react";
import clsx from "clsx";

interface CaseHeaderProps {
  caseId: string;
  isUrgent: boolean;
  title: string;
  elo: number;
  eloChange?: number | null;
}

export default function CaseHeader({
  caseId,
  isUrgent,
  title,
  elo,
  eloChange,
}: CaseHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            CASE #{caseId}
          </span>
          {isUrgent && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
              URGENT
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </div>

      {/* ELO CARD */}
      <div className="flex items-center gap-3 bg-white pl-4 pr-6 py-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 group-hover:scale-110 transition-transform">
          <Trophy className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
            Clinical Rating
          </span>
          <span className="text-xl font-mono font-bold text-slate-900 leading-none tabular-nums">
            {elo}
          </span>
        </div>
        {/* ELO Change Animation Container */}
        {eloChange !== null && eloChange !== undefined && (
          <div
            className={clsx(
              "absolute right-4 top-2 text-sm font-bold animate-float-up",
              eloChange > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {eloChange > 0 ? `+${eloChange}` : eloChange}
          </div>
        )}
      </div>
    </div>
  );
}
