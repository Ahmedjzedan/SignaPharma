"use client";

import { Search, Filter } from "lucide-react";
import { useState } from "react";
import BlogFilterModal from "./BlogFilterModal";

export default function BlogHeader() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilters = (filters: any) => {
    console.log("Filters applied:", filters);
    // In a real app, this would update the URL query params or trigger a re-fetch
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Community Blog</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
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
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:border-primary focus:ring-2 focus:ring-ring outline-none transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        </div>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="p-2 bg-background border border-input rounded-lg hover:border-primary hover:text-primary transition-colors"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <BlogFilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={handleApplyFilters} 
      />
    </div>
  );
}
