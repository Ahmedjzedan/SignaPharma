import { Library, Trophy, Flame } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    collected: number;
    elo: number;
    streak: number;
  };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up"
      style={{ animationDelay: "0.1s" }}
    >
      {/* Drugs Collected */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-50 text-medical-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Library className="w-7 h-7" />
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-900">{stats.collected}</p>
          <p className="text-sm font-medium text-slate-500">Drugs Collected</p>
        </div>
      </div>

      {/* Clinical ELO */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
        {/* Decorative background chart line */}
        <svg
          className="absolute right-0 bottom-0 w-24 h-16 text-yellow-50 opacity-50"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50 L20 40 L40 45 L60 20 L80 30 L100 10 V50 Z"
            fill="currentColor"
          />
        </svg>

        <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0 z-10">
          <Trophy className="w-7 h-7" />
        </div>
        <div className="z-10">
          <p className="text-3xl font-bold text-slate-900 font-mono">
            {stats.elo}
          </p>
          <p className="text-sm font-medium text-slate-500">
            Clinical Rating (ELO)
          </p>
        </div>
      </div>

      {/* Study Streak */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-bounce-slight">
          <Flame className="w-7 h-7" />
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.streak}{" "}
            <span className="text-lg font-normal text-slate-400">Days</span>
          </p>
          <p className="text-sm font-medium text-slate-500">Study Streak</p>
        </div>
      </div>
    </div>
  );
}
