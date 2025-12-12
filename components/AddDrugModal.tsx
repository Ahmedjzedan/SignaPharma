import { useState, useEffect } from "react";
import { X, Search, Plus, Loader2, Dice5, Heart, Wind, Stethoscope, Pill } from "lucide-react";
import { searchDrugs, FDADrugResult } from "@/app/actions/fda";
import clsx from "clsx";

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drug: FDADrugResult) => void;
  onRequest: (query: string) => void;
  existingDrugIds?: string[];
}

export default function AddDrugModal({
  isOpen,
  onClose,
  onAdd,
  onRequest,
  existingDrugIds = [],
}: AddDrugModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FDADrugResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simple debounce logic
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setResults([]);
      return;
    }

    async function fetchDrugs() {
      setIsLoading(true);
      try {
        const data = await searchDrugs(debouncedQuery);
        // Filter out existing drugs
        const filteredData = data.filter(drug => !existingDrugIds.includes(drug.id));
        setResults(filteredData);
      } catch (error) {
        console.error("Failed to search drugs", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDrugs();
  }, [debouncedQuery, existingDrugIds]);

  const handleCategoryClick = (categoryQuery: string) => {
    setQuery(categoryQuery);
  };

  const handleRandomClick = async () => {
    setIsLoading(true);
    setQuery("Random Drug..."); // Visual feedback
    try {
      const commonDrugs = ["Aspirin", "Ibuprofen", "Acetaminophen", "Lisinopril", "Metformin", "Atorvastatin", "Amoxicillin", "Omeprazole", "Losartan", "Albuterol"];
      const randomTerm = commonDrugs[Math.floor(Math.random() * commonDrugs.length)];
      
      const data = await searchDrugs(randomTerm);
      const filteredData = data.filter(drug => !existingDrugIds.includes(drug.id));
      
      if (filteredData.length > 0) {
        setQuery(randomTerm);
      } else {
        setQuery(randomTerm);
      }
    } catch (error) {
      console.error("Failed to fetch random drug", error);
      setQuery("");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl h-[600px] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all">
        
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-medical-600 to-medical-400 dark:from-medical-400 dark:to-medical-200">
                Add to Library
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Search the FDA database for approved medications</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-medical-500 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by brand name (e.g. Lipitor)..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500 transition-all shadow-sm"
              autoFocus
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Loader2 className="w-5 h-5 text-medical-500 animate-spin" />
              </div>
            )}
            {query && !isLoading && (
              <button 
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {!query && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Suggestions</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button 
                  onClick={() => setQuery("Heart")}
                  className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 rounded-2xl transition-all group text-left"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">Heart</span>
                    <span className="text-xs text-slate-400">Cardiology</span>
                  </div>
                </button>

                <button 
                  onClick={() => setQuery("Lungs")}
                  className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 rounded-2xl transition-all group text-left"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-sky-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">Lungs</span>
                    <span className="text-xs text-slate-400">Respiratory</span>
                  </div>
                </button>

                <button 
                  onClick={() => setQuery("Infection")}
                  className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 rounded-2xl transition-all group text-left"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Diseases</span>
                    <span className="text-xs text-slate-400">Infectious</span>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    const randomDrugs = ["Aspirin", "Ibuprofen", "Lisinopril", "Metformin", "Atorvastatin"];
                    setQuery(randomDrugs[Math.floor(Math.random() * randomDrugs.length)]);
                  }}
                  className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-slate-200 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-800 rounded-2xl transition-all group text-left"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-violet-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Dice5 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">Random Pick</span>
                    <span className="text-xs text-slate-400">Surprise me</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Results State */}
          {(query || isLoading) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isLoading ? "Searching Database..." : results.length > 0 ? `Found ${results.length} Results` : "No Results"}
                </p>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Loader2 className="w-10 h-10 text-medical-500 animate-spin mb-3" />
                  <p className="text-sm font-medium">Scanning FDA Database...</p>
                </div>
              )}

              {!isLoading && results.length === 0 && query.length >= 3 && (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No drugs found matching &quot;{query}&quot;</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Try searching for a different brand name</p>
                  <button
                    onClick={() => onRequest(query)}
                    className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-medical-600 dark:text-medical-400 hover:border-medical-500 transition-colors shadow-sm"
                  >
                    Request &quot;{query}&quot;
                  </button>
                </div>
              )}

              {!isLoading && results.map((drug) => (
                <div 
                  key={drug.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-medical-500 shadow-sm">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{drug.brand_name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{drug.generic_name}</p>
                      <div className="flex gap-2 mt-1">
                        {drug.pharm_class.slice(0, 1).map((cls, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onAdd(drug)}
                    className="p-3 bg-medical-600 hover:bg-medical-500 text-white rounded-xl shadow-lg shadow-medical-500/20 transform group-hover:scale-105 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
