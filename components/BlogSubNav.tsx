"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenTool, Bookmark } from "lucide-react";
import clsx from "clsx";

export default function BlogSubNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-16 w-full z-30 glass transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 h-12 overflow-x-auto no-scrollbar">
          {/* Feed Link */}
          <Link
            href="/blog"
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              isActive("/blog")
                ? "bg-slate-100 text-slate-900 font-bold border border-slate-200"
                : "text-slate-500 hover:text-medical-600 hover:bg-medical-50"
            )}
          >
            Community Feed
          </Link>

          {/* Create Post Link */}
          <Link
            href="/blog/create"
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
              isActive("/blog/create")
                ? "bg-slate-100 text-slate-900 font-bold border border-slate-200"
                : "text-slate-500 hover:text-medical-600 hover:bg-medical-50"
            )}
          >
            <PenTool className="w-3.5 h-3.5" /> Create Post
          </Link>

          {/* Saved Posts Link */}
          <Link
            href="/blog/saved"
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
              isActive("/blog/saved")
                ? "bg-slate-100 text-slate-900 font-bold border border-slate-200"
                : "text-slate-500 hover:text-medical-600 hover:bg-medical-50"
            )}
          >
            <Bookmark className="w-3.5 h-3.5" /> Saved Posts
          </Link>
        </div>
      </div>
    </nav>
  );
}
