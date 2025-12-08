"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Trash2, FileX2 } from "lucide-react";
import clsx from "clsx";
import { togglePostSave } from "@/app/actions/blog";
import { Filter } from "lucide-react";
import BlogFilterModal from "./BlogFilterModal";

function stripMarkdown(text: string) {
  return text
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Keep link text
    .replace(/[*_`#]/g, '') // Remove special chars
    .replace(/>\s*/g, '') // Remove blockquotes
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
}

export interface SavedPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  readTime: string;
  category: string;
  colorClass: string;
}

interface SavedRantsGridProps {
  initialSavedPosts: SavedPost[];
}

export default function SavedRantsGrid({ initialSavedPosts }: SavedRantsGridProps) {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>(initialSavedPosts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({ category: "All", sortBy: "Newest" });

  const filteredPosts = savedPosts
    .filter((post) => filter.category === "All" || post.category === filter.category)
    .sort((a, b) => {
      if (filter.sortBy === "Newest") return 0; // Already sorted by desc savedAt from DB usually, but we might need date
      // For now, simple client side sort if we had dates. 
      // Since we don't have full dates in SavedPost interface (only readTime/category/author), 
      // we'll stick to category filtering for now or assume initial order is Newest.
      return 0;
    });

  const handleRemove = async (id: string) => {
    // Optimistic update
    setSavedPosts((prev) => prev.filter((post) => post.id !== id));
    
    try {
      await togglePostSave(id);
    } catch (error) {
      console.error("Failed to remove saved post", error);
      // Revert if failed - strictly speaking we should refetch or add it back
      // For now, we assume success or user will refresh
    }
  };

  if (savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <FileX2 className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Nothing to see here
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          You haven&apos;t saved anything. Do you even read, or do you just scroll
          looking for pictures?
        </p>
        <Link
          href="/blog"
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-md"
        >
          Browse Articles
        </Link>
      </div>
    );
  }


  return (
    <>
      {/* Header moved inside to control filtering */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Saved Rants</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
              {filteredPosts.length} Items
            </span>
          </div>
          <p className="text-muted-foreground">
            Articles you promised yourself you&apos;d read &quot;when you have time.&quot;
            (Spoiler: You won&apos;t).
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg hover:border-medical-500 hover:text-medical-600 transition-all text-sm font-medium"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <BlogFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(newFilter) => setFilter(newFilter)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="group bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 relative overflow-hidden flex flex-col"
          >
          {/* Image Header */}
          <div className={clsx("h-40 relative", post.colorClass)}>
            <span className="absolute top-4 right-4 bg-background/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-foreground shadow-sm">
              {post.category}
            </span>
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <h3 className="font-bold text-card-foreground text-lg mb-2 leading-tight">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {stripMarkdown(post.excerpt)}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {post.author}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{post.readTime}</span>
            </div>
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-6">
            <Link
              href={`/blog/${post.id}`}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <BookOpen className="w-4 h-4" /> Read Now
            </Link>
            <button
              onClick={() => handleRemove(post.id)}
              className="w-full py-2.5 bg-card border border-destructive/30 text-destructive rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
            >
              <Trash2 className="w-4 h-4" /> Remove from Saved
            </button>
          </div>
        </div>
      ))}
      </div>
    </>
  );
}
