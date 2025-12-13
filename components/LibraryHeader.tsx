import { PlusCircle, Search } from "lucide-react";

interface LibraryHeaderProps {
  stats: {
    collected: number;
    total: number;
    mastered: number;
    streak: number;
  };
  onAddDrug: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

export default function LibraryHeader({ stats, onAddDrug, searchQuery, onSearch }: LibraryHeaderProps) {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My Medicine Cabinet
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal formulary. Master 50 drugs to unlock the
            &quot;Walking Lexicomp&quot; badge.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search library..."
              className="pl-9 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64"
            />
          </div>

          <button
            onClick={onAddDrug}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-bold shadow-lg shadow-medical-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden md:inline">Add Drug</span>
            <span className="md:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* STATS ROW */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Collected
          </p>
          <p className="text-2xl font-bold text-card-foreground mt-1">
            {stats.collected}
            <span className="text-muted-foreground text-lg">/{stats.total}</span>
          </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Mastered
          </p>
          <p className="text-2xl font-bold text-medical-600 mt-1">
            {stats.mastered}
          </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Study Streak
          </p>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            {stats.streak}{" "}
            <span className="text-sm text-muted-foreground font-normal">days</span>
          </p>
        </div>
      </div>
    </>
  );
}
