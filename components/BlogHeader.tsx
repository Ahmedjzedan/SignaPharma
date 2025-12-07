import { Search, Filter } from "lucide-react";

export default function BlogHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Community Blog</h1>
        <p className="text-slate-500 mt-2 max-w-xl">
          Rants, clinical pearls, and survival guides. Opinions are our own (and
          probably correct).
        </p>
      </div>

      {/* Filter/Search */}
      <div className="flex gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search rants..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>
        <button className="p-2 bg-white border border-slate-200 rounded-lg hover:border-medical-500 hover:text-medical-600 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
