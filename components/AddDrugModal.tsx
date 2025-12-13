import { useState, useEffect } from "react";
import { X, Search, Plus, Loader2, Dice5, Heart, Wind, Stethoscope, Pill } from "lucide-react";
import { searchDrugs, FDADrugResult } from "@/app/actions/fda";
import { getRandomDrug } from "@/app/actions/drugs";
import { toast } from "sonner";
import clsx from "clsx";

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drug: FDADrugResult) => void;
  onRequest: (query: string) => void;
  existingDrugIds?: string[];
  existingDrugNames?: string[];
}

export default function AddDrugModal({
  isOpen,
  onClose,
  onAdd,
  onRequest,
  existingDrugIds = [],
  existingDrugNames = [],
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
        setResults(data);
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
    try {
      const randomDrug = await getRandomDrug();
      
      if (randomDrug) {
        // Auto-add to library
        // Ensure properties are strings to match FDADrugResult
        const safeRandomDrug: FDADrugResult = {
          ...randomDrug,
          description: randomDrug.description || "",
          mechanism_of_action: randomDrug.mechanism_of_action || "",
          warnings: randomDrug.warnings || "",
          indications_and_usage: randomDrug.indications_and_usage || "",
          dosage_and_administration: randomDrug.dosage_and_administration || "",
          active_ingredient: randomDrug.active_ingredient || "",
        };
        onAdd(safeRandomDrug);
        // The actual saving happens in onAdd usually, but let's make sure we call the server action if onAdd doesn't do it fully or if we want to be sure.
        // Actually, onAdd in LibraryContent calls saveDrugToLibrary.
        // But we need to pass the FDADrugResult structure.
        // getRandomDrug returns that structure.
        
        toast.success(`Added ${randomDrug.brand_name} to library!`);
        onClose();
      } else {
        toast.info("Wow! You have collected all available drugs!");
      }
    } catch (error) {
      console.error("Failed to fetch random drug", error);
      toast.error("Failed to pick a random drug.");
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl h-[600px] flex flex-col bg-background rounded-3xl shadow-2xl overflow-hidden border border-border transition-all">
        
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-border bg-background/80 backdrop-blur-xl z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                Add to Library
              </h2>
              <p className="text-muted-foreground text-sm font-medium">Search the FDA database for approved medications</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by brand name (e.g. Lipitor)..."
              className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-input rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              autoFocus
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            )}
            {query && !isLoading && (
              <button 
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"
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
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Suggested Drugs</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3 mb-8">
                <button 
                  onClick={handleRandomClick}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:to-fuchsia-500/20 border border-violet-200/50 dark:border-violet-800/50 rounded-2xl transition-all group text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-3 bg-background rounded-xl text-violet-500 shadow-sm group-hover:scale-110 transition-transform z-10">
                    <Dice5 className="w-6 h-6" />
                  </div>
                  <div className="z-10">
                    <span className="block font-bold text-foreground text-lg group-hover:text-violet-600 dark:group-hover:text-violet-400">Random Pick</span>
                    <span className="text-sm text-muted-foreground">Add a random drug to your library instantly</span>
                  </div>
                </button>
              </div>

              <div className="space-y-3">
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                   Popular Searches
                 </p>
                 <div className="flex flex-wrap gap-2">
                    {["Atorvastatin", "Lisinopril", "Metformin", "Amlodipine", "Omeprazole", "Losartan", "Albuterol", "Gabapentin", "Hydrochlorothiazide", "Sertraline"]
                      .filter(term => !existingDrugNames.some(name => name.toLowerCase() === term.toLowerCase()))
                      .slice(0, 6)
                      .map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* Results State */}
          {(query || isLoading) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {isLoading ? "Searching Database..." : results.length > 0 ? `Found ${results.length} Results` : "No Results"}
                </p>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                  <p className="text-sm font-medium">Scanning FDA Database...</p>
                </div>
              )}

              {!isLoading && results.length === 0 && query.length >= 3 && (
                <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground font-medium">No drugs found matching &quot;{query}&quot;</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">Try searching for a different brand name</p>
                  <button
                    onClick={() => onRequest(query)}
                    className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-bold text-primary hover:border-primary transition-colors shadow-sm"
                  >
                    Request &quot;{query}&quot;
                  </button>
                </div>
              )}

              {!isLoading && results.map((drug) => (
                <div 
                  key={drug.id}
                  className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 border border-border rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background rounded-xl text-primary shadow-sm">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{drug.brand_name}</h4>
                      <p className="text-sm text-muted-foreground">{drug.generic_name}</p>
                      <div className="flex gap-2 mt-1">
                        {drug.pharm_class.slice(0, 1).map((cls, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground rounded-full">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onAdd(drug)}
                    disabled={existingDrugIds.includes(drug.id)}
                    className={clsx(
                      "p-3 rounded-xl shadow-lg transition-all transform group-hover:scale-105",
                      existingDrugIds.includes(drug.id)
                        ? "bg-[hsl(var(--in-library-bg))] text-[hsl(var(--in-library-text))] cursor-default shadow-none"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                    )}
                  >
                    {existingDrugIds.includes(drug.id) ? (
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-xs font-bold">In Library</span>
                      </div>
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
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
