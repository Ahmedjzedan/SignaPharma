import { useState, useEffect } from "react";
import { X, Search, Plus, Loader2, Dice5, Heart, Wind, Stethoscope } from "lucide-react";
import { searchDrugs, FDADrugResult } from "@/app/actions/fda";

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drug: FDADrugResult) => void;
  existingDrugIds?: string[];
}

export default function AddDrugModal({
  isOpen,
  onClose,
  onAdd,
  existingDrugIds = [],
}: AddDrugModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FDADrugResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simple debounce logic if hook not available
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
      // List of common drugs to pick from for "random" effect
      const commonDrugs = ["Aspirin", "Ibuprofen", "Acetaminophen", "Lisinopril", "Metformin", "Atorvastatin", "Amoxicillin", "Omeprazole", "Losartan", "Albuterol"];
      const randomTerm = commonDrugs[Math.floor(Math.random() * commonDrugs.length)];
      
      // Perform search with the random term
      const data = await searchDrugs(randomTerm);
      
      // Filter and pick one
      const filteredData = data.filter(drug => !existingDrugIds.includes(drug.id));
      
      if (filteredData.length > 0) {
        // Pick a random one from the results to be even more random
        const randomDrug = filteredData[Math.floor(Math.random() * filteredData.length)];
        onAdd(randomDrug); // Directly add it? Or show it? User said "chose a random drug", usually implies picking it.
        // But maybe better to show it as a result? 
        // "make a card with a dice icon that will chose a random drug"
        // Let's just set the query to the random term and let the user see results, 
        // OR better, simulate a "I'm feeling lucky" and just add it?
        // "rename the button to add drug to library" -> "chose a random drug"
        // Let's show the results for the random term for now, it's safer UX.
        // Actually, let's set the query to the random term.
        setQuery(randomTerm);
      } else {
        setQuery(randomTerm); // Let the normal search handle "no results" or show what was found even if filtered
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
      className="fixed inset-0 z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0 pointer-events-none">
        <div className="relative transform overflow-hidden rounded-2xl bg-card text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl pointer-events-auto border border-border">
          <div className="bg-muted px-4 py-3 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-card-foreground">Add to Library</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by generic or brand name..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent text-sm text-foreground placeholder:text-muted-foreground"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Categories / Results */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              {!query && !isLoading && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button 
                    onClick={handleRandomClick}
                    className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl transition-all group"
                  >
                    <Dice5 className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Random Pick</span>
                  </button>
                  
                  <button 
                    onClick={() => handleCategoryClick("Cardiovascular")}
                    className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl transition-all group"
                  >
                    <Heart className="w-8 h-8 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-red-700 dark:text-red-300">Heart</span>
                  </button>

                  <button 
                    onClick={() => handleCategoryClick("Respiratory")}
                    className="flex flex-col items-center justify-center p-4 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-xl transition-all group"
                  >
                    <Wind className="w-8 h-8 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">Lungs</span>
                  </button>

                  <button 
                    onClick={() => handleCategoryClick("Infection")}
                    className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-xl transition-all group"
                  >
                    <Stethoscope className="w-8 h-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-purple-700 dark:text-purple-300">Diseases</span>
                  </button>
                </div>
              )}

              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                {isLoading ? "Searching..." : results.length > 0 ? "Results" : query.length >= 3 ? "No Results" : "Suggestions"}
              </p>

              {isLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-medical-500 animate-spin" />
                </div>
              )}

              {!isLoading && results.length === 0 && query.length >= 3 && (
                <div className="text-center py-8 text-muted-foreground">
                  No drugs found matching &quot;{query}&quot;
                </div>
              )}

              {!isLoading && results.map((drug) => (
                <div key={drug.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted border border-transparent hover:border-border transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded shrink-0 flex items-center justify-center font-bold text-xs uppercase">
                      {drug.brand_name.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-card-foreground text-sm truncate">
                        {drug.brand_name} <span className="text-muted-foreground font-normal">({drug.generic_name})</span>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {drug.pharm_class[0] || "Unknown Class"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onAdd(drug)}
                    className="w-8 h-8 rounded-full bg-medical-50 text-medical-600 shrink-0 flex items-center justify-center hover:bg-medical-600 hover:text-white transition-colors ml-2"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
