"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Trash2, FileX2 } from "lucide-react";
import clsx from "clsx";

interface SavedPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  readTime: string;
  category: string;
  colorClass: string;
}

const initialSavedPosts: SavedPost[] = [
  {
    id: "1",
    title: 'Why "Clinical Judgement" is Just Fancy Guessing',
    excerpt:
      "We pretend it's evidence-based, but half the time we're just vibing.",
    author: "Dr. Sarah Jenks",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    readTime: "10 min read",
    category: "Clinical",
    colorClass: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    id: "2",
    title: "Night Shift Survival Guide: Caffeine & Spite",
    excerpt:
      "How to maintain a circadian rhythm when your body thinks it&apos;s dying.",
    author: "Jess Chen",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    readTime: "5 min read",
    category: "Lifestyle",
    colorClass: "bg-gradient-to-br from-amber-400 to-orange-500",
  },
  {
    id: "3",
    title: "2025 Hypertension Guidelines: Salt is Back?",
    excerpt:
      "Just kidding. But the new beta-blocker positioning is actually interesting.",
    author: "Mike Ross",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mason",
    readTime: "15 min read",
    category: "Study",
    colorClass: "bg-gradient-to-br from-emerald-400 to-cyan-600",
  },
];

export default function SavedRantsGrid() {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>(initialSavedPosts);

  const handleRemove = (id: string) => {
    setSavedPosts((prev) => prev.filter((post) => post.id !== id));
  };

  if (savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <FileX2 className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Nothing to see here
        </h2>
        <p className="text-slate-500 max-w-md mb-8">
          You haven&apos;t saved anything. Do you even read, or do you just scroll
          looking for pictures?
        </p>
        <Link
          href="/blog"
          className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl transition-all shadow-md"
        >
          Browse Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
      {savedPosts.map((post) => (
        <div
          key={post.id}
          className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col"
        >
          {/* Image Header */}
          <div className={clsx("h-40 relative", post.colorClass)}>
            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-slate-800 shadow-sm">
              {post.category}
            </span>
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight">
              {post.title}
            </h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  {post.author}
                </span>
              </div>
              <span className="text-xs text-slate-400">{post.readTime}</span>
            </div>
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-6">
            <Link
              href={`/blog/${post.id}`}
              className="w-full py-2.5 bg-medical-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-medical-700 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <BookOpen className="w-4 h-4" /> Read Now
            </Link>
            <button
              onClick={() => handleRemove(post.id)}
              className="w-full py-2.5 bg-white border border-red-200 text-red-500 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-300 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
            >
              <Trash2 className="w-4 h-4" /> Remove from Saved
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
