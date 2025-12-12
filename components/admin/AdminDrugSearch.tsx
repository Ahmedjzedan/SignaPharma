"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Loader2, Check } from "lucide-react";
import { searchLocalDrugs, approveDrugRequest } from "@/app/actions/admin";
import ViewDrugModal from "./ViewDrugModal";
import { useRouter } from "next/navigation";

export default function AdminDrugSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  // Simple debounce effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        const data = await searchLocalDrugs(query);
        setResults(data);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAddDrug = async () => {
    if (!query) return;
    setIsAdding(true);
    try {
      // We reuse approveDrugRequest but we need a "request ID". 
      // Since this is a direct add, we might need to create a dummy request first OR 
      // modify approveDrugRequest to handle direct adds. 
      // For now, let's create a quick request and approve it instantly to keep the flow consistent.
      // Actually, let's just create a new server action for this or use a trick.
      // Better: Create a new action `directAddDrug(name)` in admin.ts.
      // But to save time, I'll create a request client-side then approve it? No, that's slow.
      // Let's assume we pass a dummy ID or handle it.
      // Wait, `approveDrugRequest` takes `requestId`.
      // Let's make a new action `addDrugDirectly` in admin.ts?
      // Or just use `approveDrugRequest` and pass a special flag?
      // Let's create a new action in the next step. For now I'll call a placeholder.
      
      // Temporary: We will implement `addDrugDirectly` in admin.ts next.
      // await addDrugDirectly(query); 
      
      // For now, I'll just reload to show I clicked it.
      console.log("Adding drug:", query);
    } catch (error) {
      console.error("Failed to add drug", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search to add or view drug..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-card-foreground shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      {/* Results or Add Option */}
      {(query.length >= 2 || results.length > 0) && (
        <div className="bg-card border rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {results.map((drug) => (
                <div key={drug.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                  <div>
                    <p className="font-bold text-foreground">{drug.brandName}</p>
                    <p className="text-sm text-muted-foreground">{drug.genericName}</p>
                  </div>
                  <ViewDrugModal drug={drug} />
                </div>
              ))}

              {/* Add New Option */}
              <div className="p-4 bg-muted/30 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Not in library?</p>
                  <p className="text-sm text-muted-foreground">Add <span className="font-bold">"{query}"</span> using Gemini AI</p>
                </div>
                <form action={async () => {
                    // We need to import this action. I'll add it to the imports above after creating it.
                    // For now, using a hidden input to pass the query.
                    const { addDrugDirectly } = await import("@/app/actions/admin");
                    await addDrugDirectly(query);
                    setQuery("");
                    setResults([]);
                    router.refresh();
                }}>
                    <button 
                        type="submit"
                        disabled={isAdding}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                    >
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add to Library
                    </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
