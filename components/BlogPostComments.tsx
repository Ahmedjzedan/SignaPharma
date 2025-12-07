"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { addComment } from "@/lib/actions/comments";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";

interface Comment {
  id: string;
  author: {
    name: string | null;
    image: string | null;
  };
  content: string;
  createdAt: Date | null;
  parentId: string | null;
  replies?: Comment[];
}

interface BlogPostCommentsProps {
  postId: string;
  initialComments?: Comment[];
  session?: any;
}

// Extracted CommentItem component to prevent re-renders and state loss
const CommentItem = ({ 
  comment, 
  depth = 0, 
  session, 
  onReply 
}: { 
  comment: Comment; 
  depth?: number; 
  session: any;
  onReply: (parentId: string, content: string) => Promise<void>;
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleReply = async () => {
    if (!replyText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyText);
      setReplyText("");
      setIsReplying(false);
      setShowReplies(true); // Auto-expand to show the new reply (though page reload might reset this unless persisted)
    } catch (error) {
      console.error("Failed to reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex gap-4", depth > 0 && "mt-4")}>
      <div className="flex-shrink-0">
        <img
          src={comment.author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.name}`}
          alt={comment.author.name || "User"}
          className="w-10 h-10 rounded-full bg-muted"
        />
      </div>
      <div className="flex-grow">
        <div className={cn("bg-card p-5 rounded-2xl border border-border shadow-sm", depth > 0 && "bg-muted/50")}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-card-foreground">{comment.author.name || "Anonymous"}</span>
            <span className="text-xs text-muted-foreground">
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : "Just now"}
            </span>
          </div>
          <p className="text-foreground text-sm leading-relaxed">{comment.content}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-2 ml-2">
          {session && (
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <Reply className="w-3 h-3" /> Reply
            </button>
          )}
          {hasReplies && (
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showReplies ? "Hide Replies" : `View ${comment.replies?.length} Replies`}
            </button>
          )}
        </div>

        {isReplying && session && (
          <div className="mt-3 flex gap-3 animate-fade-in">
            <div className="flex-grow relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author.name}...`}
                className="w-full pl-4 pr-12 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none text-sm text-foreground"
                autoFocus
              />
              <button
                onClick={handleReply}
                disabled={isSubmitting || !replyText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {hasReplies && showReplies && (
          <div className="mt-4 pl-4 border-l-2 border-border">
            {comment.replies?.map((reply) => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                depth={depth + 1} 
                session={session}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function BlogPostComments({ postId, initialComments = [], session }: BlogPostCommentsProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>(initialComments);

  useEffect(() => {
    setCommentsList(initialComments);
  }, [initialComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, commentText);
      setCommentText("");
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string, content: string) => {
    try {
      await addComment(postId, content, parentId);
      window.location.reload();
    } catch (error) {
      console.error("Failed to post reply:", error);
      throw error; // Propagate to child to handle loading state if needed
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-primary" />
        Discussion ({commentsList.length})
      </h3>

      {/* Comment Form */}
      <div className="mb-12 bg-muted/30 rounded-2xl p-6 border border-border">
        {session ? (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-background border border-border overflow-hidden flex-shrink-0">
              <img
                src={session.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full bg-background border border-input rounded-xl p-4 focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                required
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" /> Post Comment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Please sign in to leave a comment.</p>
            <a href="/auth" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Sign In
            </a>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {commentsList.length > 0 ? (
          commentsList.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              session={session}
              onReply={handleReplySubmit}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-3xl border border-dashed border-border">
            <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
