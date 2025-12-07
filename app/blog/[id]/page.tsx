
import BlogPostHeader from "../../../components/BlogPostHeader";
import BlogPostContent from "../../../components/BlogPostContent";
import BlogPostComments from "../../../components/BlogPostComments";
import { Metadata } from "next";


import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { posts, users, comments } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getPostStats } from "@/app/actions/blog";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  if (!post) {
    return {
      title: "Post Not Found | SignaPharma",
    };
  }

  return {
    title: `${post.title} | SignaPharma`,
    description: post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  if (!post) {
    notFound();
  }

  const author = await db.query.users.findFirst({
    where: eq(users.id, post.authorId || ""),
  });

  const stats = await getPostStats(id);
  
  // Get comments count
  const [commentsCountResult] = await db.select({ count: count() }).from(comments).where(eq(comments.postId, id));
  const commentsCount = commentsCountResult.count;

  const formattedPost = {
    title: post.title,
    author: author?.name || "Unknown Author",
    role: author?.role || "Contributor",
    date: post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "Unknown Date",
    readTime: "5 min read", // Placeholder or calculate based on word count
    views: "1.2k views", // Placeholder
    avatarSeed: author?.name || "User",
    tags: [
      { label: `#${post.category || "General"}`, color: "bg-medical-50 text-medical-600 border-medical-100" },
    ],
    gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
  };

  // Fetch all comments for this post
  const allComments = await db.query.comments.findMany({
    where: eq(comments.postId, id),
    with: {
      author: true,
    },
    orderBy: [desc(comments.createdAt)],
  });

  // Organize comments into a tree structure
  const commentMap = new Map();
  const rootComments: any[] = [];

  allComments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  allComments.forEach(comment => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(commentMap.get(comment.id));
      } else {
        // Parent might be deleted or not loaded, treat as root or orphan
        // For simplicity, let's treat as root if parent not found
        rootComments.push(commentMap.get(comment.id));
      }
    } else {
      rootComments.push(commentMap.get(comment.id));
    }
  });

  // Sort replies by date (oldest first usually for replies, but let's keep newest first for consistency)
  // Actually, replies usually read top-down, so oldest first is better for conversation flow.
  // But root comments usually newest first.
  // Let's stick to the query order (descending) for now, so newest replies on top.

  const session = await auth();

  return (
    <>
      <main className="flex-grow pt-28 pb-20 animate-fade-in">
        <BlogPostHeader 
          {...formattedPost} 
          isAuthor={session?.user?.id === post.authorId}
          postId={post.id}
        />
        <BlogPostContent 
          content={post.content} 
          postId={post.id}
          initialLikes={stats.likes}
          initialIsLiked={stats.isLiked}
          initialIsSaved={stats.isSaved}
          commentsCount={commentsCount}
        />
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" id="comments-section">
          <BlogPostComments postId={post.id} initialComments={rootComments} session={session} />
        </article>
      </main>
    </>
  );
}
