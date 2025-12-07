"use client";

import { X, Check } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

interface BlogFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function BlogFilterModal({ isOpen, onClose, onApply }: BlogFilterModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Newest");

  if (!isOpen) return null;

  const categories = ["All", "General", "Study Tips", "Rant", "Clinical", "News"];
  const sortOptions = ["Newest", "Oldest", "Most Liked", "Most Viewed"];

  const handleApply = () => {
    onApply({ category: selectedCategory, sortBy });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-popover rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in border border-border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold text-popover-foreground">Filter Posts</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Categories */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                    selectedCategory === category
                      ? "bg-primary/10 text-primary border-primary/20 ring-2 ring-primary/10"
                      : "bg-popover text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-3">Sort By</label>
            <div className="grid grid-cols-2 gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={clsx(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-all border flex items-center justify-between",
                    sortBy === option
                      ? "bg-primary/10 text-primary border-primary/20 ring-2 ring-primary/10"
                      : "bg-popover text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {option}
                  {sortBy === option && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/50 border-t border-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-muted-foreground font-medium hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
