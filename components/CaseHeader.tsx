import { Trophy } from "lucide-react";
import clsx from "clsx";

interface CaseHeaderProps {
  caseId: string;
  isUrgent: boolean;
  title: string;
  elo: number;
  eloChange?: number | null;
  isLayperson?: boolean;
  casesSolved?: number;
  authorName?: string;
}

export default function CaseHeader({
  caseId,
  isUrgent,
  title,
  elo,
  eloChange,
  isLayperson,
  casesSolved = 0,
  authorName,
}: CaseHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
            CASE #{caseId}
          </span>
          {isUrgent && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
              URGENT
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {authorName && (
          <p className="text-sm text-muted-foreground mt-1">
            Made by <span className="font-medium text-foreground">{authorName}</span>
          </p>
        )}
      </div>

      {/* ELO CARD or CASES DONE CARD */}
      <div className="flex items-center gap-3 bg-card pl-4 pr-6 py-3 rounded-xl border border-border shadow-sm relative overflow-hidden group">
        <div className={clsx(
          "p-2 rounded-lg group-hover:scale-110 transition-transform",
          isLayperson ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"
        )}>
          <Trophy className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">
            {isLayperson ? "Cases Solved" : "Clinical Rating"}
          </span>
          <span className="text-xl font-mono font-bold text-card-foreground leading-none tabular-nums">
            {isLayperson ? casesSolved : elo}
          </span>
        </div>
        {/* ELO Change Animation Container (Only for Pros) */}
        {!isLayperson && eloChange !== null && eloChange !== undefined && (
          <div
            className={clsx(
              "absolute right-4 top-2 text-sm font-bold animate-float-up",
              eloChange > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {eloChange > 0 ? `+${eloChange}` : eloChange}
          </div>
        )}
        {/* Cases Solved Animation (Only for Layperson) */}
        {isLayperson && eloChange !== null && eloChange !== undefined && eloChange > 0 && (
           <div className="absolute right-4 top-2 text-sm font-bold animate-float-up text-green-600">
             +1
           </div>
        )}
      </div>
    </div>
  );
}
