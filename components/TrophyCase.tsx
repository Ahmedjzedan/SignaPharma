import { Medal, Pin, Moon, Dna, HeartPulse, BookOpen, Lock } from "lucide-react";
import clsx from "clsx";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: "yellow" | "green" | "red" | "blue" | "slate";
  isPinned?: boolean;
  isLocked?: boolean;
}

const badges: Badge[] = [
  {
    id: "1",
    name: "Night Shift Survivor",
    description: "3 nights w/o caffeine overdose",
    icon: <Moon className="w-10 h-10 text-yellow-400" />,
    color: "yellow",
    isPinned: true,
  },
  {
    id: "2",
    name: "Bio Master",
    description: 'Correctly pronounced "Adalimumab"',
    icon: <Dna className="w-10 h-10 text-white" />,
    color: "green",
    isPinned: true,
  },
  {
    id: "3",
    name: "Code Blue Hero",
    description: "Didn't faint during compressions",
    icon: <HeartPulse className="w-10 h-10 text-white" />,
    color: "red",
  },
  {
    id: "4",
    name: "Walking Lexicomp",
    description: "Memorized 50 drugs",
    icon: <BookOpen className="w-10 h-10 text-white" />,
    color: "blue",
  },
  {
    id: "5",
    name: "Admin God",
    description: "Locked",
    icon: <Lock className="w-8 h-8 text-slate-400" />,
    color: "slate",
    isLocked: true,
  },
  {
    id: "6",
    name: "Retirement Ready",
    description: "Locked",
    icon: <Lock className="w-8 h-8 text-slate-400" />,
    color: "slate",
    isLocked: true,
  },
];

const colorMap = {
  yellow: {
    bg: "bg-gradient-to-br from-slate-800 to-slate-900",
    ring: "ring-slate-100",
  },
  green: {
    bg: "bg-gradient-to-br from-green-400 to-emerald-600",
    ring: "ring-green-50",
  },
  red: {
    bg: "bg-gradient-to-br from-red-400 to-pink-600",
    ring: "ring-red-50",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-400 to-indigo-600",
    ring: "ring-blue-50",
  },
  slate: {
    bg: "bg-slate-200",
    ring: "ring-transparent border-2 border-dashed border-slate-400",
  },
};

export default function TrophyCase() {
  return (
    <div
      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 animate-slide-up"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Medal className="w-5 h-5 text-medical-600" /> Trophy Case
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pin your top 5 achievements to annoy your colleagues.
          </p>
        </div>
        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
          8 / 24 Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {badges.map((badge) => {
          const styles = colorMap[badge.color];

          if (badge.isLocked) {
            return (
              <div
                key={badge.id}
                className="flex flex-col items-center opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed"
              >
                <div
                  className={clsx(
                    "w-20 h-20 rounded-full flex items-center justify-center mb-3 ring-4",
                    styles.bg,
                    styles.ring
                  )}
                >
                  {badge.icon}
                </div>
                <span className="text-xs font-bold text-slate-400 text-center">
                  {badge.name}
                </span>
              </div>
            );
          }

          return (
            <div
              key={badge.id}
              className="flex flex-col items-center group cursor-pointer relative"
            >
              {badge.isPinned && (
                <div className="absolute top-0 right-2 w-4 h-4 bg-medical-600 rounded-full border-2 border-white flex items-center justify-center z-10">
                  <Pin className="w-2 h-2 text-white fill-current" />
                </div>
              )}
              <div
                className={clsx(
                  "w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 ring-4 has-tooltip",
                  styles.bg,
                  styles.ring
                )}
              >
                {badge.icon}
                <span className="tooltip">{badge.description}</span>
              </div>
              <span className="text-xs font-bold text-slate-700 text-center">
                {badge.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
