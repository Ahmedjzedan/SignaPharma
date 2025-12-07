import { PlusCircle } from "lucide-react";

interface LibraryHeaderProps {
  stats: {
    collected: number;
    total: number;
    mastered: number;
    streak: number;
  };
  onAddDrug: () => void;
}

export default function LibraryHeader({ stats, onAddDrug }: LibraryHeaderProps) {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            My Medicine Cabinet
          </h1>
          <p className="text-slate-500 mt-2">
            Manage your personal formulary. Master 50 drugs to unlock the
            "Walking Lexicomp" badge.
          </p>
        </div>

        <button
          onClick={onAddDrug}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-bold shadow-lg shadow-medical-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Drug
        </button>
      </div>

      {/* STATS ROW */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Collected
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {stats.collected}
            <span className="text-slate-400 text-lg">/{stats.total}</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Mastered
          </p>
          <p className="text-2xl font-bold text-medical-600 mt-1">
            {stats.mastered}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Study Streak
          </p>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            {stats.streak}{" "}
            <span className="text-sm text-slate-400 font-normal">days</span>
          </p>
        </div>
      </div>
    </>
  );
}
