"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenTool, Bookmark, FileText } from "lucide-react";
import clsx from "clsx";

export default function BlogSubNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-[63px] w-full z-30 glass transition-all bg-background/95 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 h-12 overflow-x-auto no-scrollbar">
          {/* Feed Link */}
          <Link
            href="/blog"
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              isActive("/blog")
                ? "bg-accent text-accent-foreground font-bold border border-border"
                : "text-muted-foreground hover:text-primary hover:bg-accent"
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
                ? "bg-accent text-accent-foreground font-bold border border-border"
                : "text-muted-foreground hover:text-primary hover:bg-accent"
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
                ? "bg-accent text-accent-foreground font-bold border border-border"
                : "text-muted-foreground hover:text-primary hover:bg-accent"
            )}
          >
            <Bookmark className="w-3.5 h-3.5" /> Saved Posts
          </Link>

          {/* My Posts Link */}
          <Link
            href="/blog/my-posts"
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
              isActive("/blog/my-posts")
                ? "bg-accent text-accent-foreground font-bold border border-border"
                : "text-muted-foreground hover:text-primary hover:bg-accent"
            )}
          >
            <FileText className="w-3.5 h-3.5" /> My Posts
          </Link>
        </div>
      </div>
    </nav>
  );
}
