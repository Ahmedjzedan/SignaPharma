'use client';

import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { togglePostLike, togglePostSave, incrementPostViews } from "@/app/actions/blog";
import { cn } from "@/lib/utils";

interface BlogPostContentProps {
  content: string;
  postId: string;
  initialLikes: number;
  initialIsLiked: boolean;
  initialIsSaved: boolean;
  commentsCount: number;
}

export default function BlogPostContent({ 
  content, 
  postId, 
  initialLikes, 
  initialIsLiked, 
  initialIsSaved,
  commentsCount
}: BlogPostContentProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  useEffect(() => {
    incrementPostViews(postId);
  }, [postId]);

  const handleLike = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    
    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? prev + 1 : prev - 1);

    try {
      await togglePostLike(postId);
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikes(prev => !newIsLiked ? prev + 1 : prev - 1);
      console.error("Failed to toggle like", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleSave = async () => {
    if (isSaveLoading) return;
    setIsSaveLoading(true);

    // Optimistic update
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);

    try {
      await togglePostSave(postId);
    } catch (error) {
      // Revert on error
      setIsSaved(!newIsSaved);
      console.error("Failed to toggle save", error);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const scrollToComments = () => {
    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Content Body */}
      <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground mb-12">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      {/* Engagement / Actions */}
      <div className="flex items-center justify-between border-t border-b border-border py-6 mb-12">
        <div className="flex gap-6">
          <button 
            onClick={handleLike}
            disabled={isLikeLoading}
            className={cn(
              "flex items-center gap-2 transition-colors group",
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            )}
          >
            <div className={cn(
              "p-2 rounded-full transition-colors",
              isLiked ? "bg-red-50 dark:bg-red-900/20" : "bg-muted group-hover:bg-red-50 dark:group-hover:bg-red-900/20"
            )}>
              <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            </div>
            <span className="font-medium">{likes} Likes</span>
          </button>
          <button 
            onClick={scrollToComments}
            className="flex items-center gap-2 text-muted-foreground hover:text-medical-600 transition-colors group"
          >
            <div className="p-2 rounded-full bg-muted group-hover:bg-medical-50 dark:group-hover:bg-medical-900/20 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="font-medium">{commentsCount} Comments</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaveLoading}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isSaved ? "text-medical-600 bg-medical-50 dark:bg-medical-900/20" : "text-muted-foreground hover:text-medical-600 bg-muted hover:bg-medical-50 dark:hover:bg-medical-900/20"
            )}
            title={isSaved ? "Saved" : "Save Post"}
          >
            <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
          </button>
          <button
            className="p-2 text-muted-foreground hover:text-medical-600 bg-muted rounded-lg hover:bg-medical-50 dark:hover:bg-medical-900/20 transition-colors"
            title="Share"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              // Could add a toast here
            }}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
