
import SavedRantsGrid, { SavedPost } from "../../../components/SavedRantsGrid";
import { Filter } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { savedPosts, posts, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function SavedRantsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const savedPostsData = await db
    .select({
      post: posts,
      author: users,
      savedAt: savedPosts.savedAt,
    })
    .from(savedPosts)
    .innerJoin(posts, eq(savedPosts.postId, posts.id))
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(savedPosts.userId, session.user.id))
    .orderBy(desc(savedPosts.savedAt));

  const formattedSavedPosts: SavedPost[] = savedPostsData.map(({ post, author }) => ({
    id: post.id,
    title: post.title,
    excerpt: post.content.substring(0, 150) + "...",
    author: author?.name || "Unknown Author",
    authorAvatar: author?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    readTime: "5 min read", // Placeholder
    category: post.category || "General",
    colorClass: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500", // Placeholder or dynamic based on category
  }));

  return (
    <>
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}


        <SavedRantsGrid initialSavedPosts={formattedSavedPosts} />
      </main>
    </>
  );
}
