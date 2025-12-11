import BlogHeader from "../../components/BlogHeader";
import BlogGrid, { BlogPost } from "../../components/BlogGrid";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq, like, and, desc, asc, sql, isNull } from "drizzle-orm";

export const metadata: Metadata = {
  title: "SignaPharma | Community Blog",
  description: "Rants, clinical pearls, and survival guides.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, search, sortBy } = await searchParams;

  const whereConditions = [isNull(posts.deletedAt)];

  if (category && typeof category === "string" && category !== "All") {
    whereConditions.push(eq(posts.category, category));
  }

  if (search && typeof search === "string") {
    whereConditions.push(like(posts.title, `%${search}%`));
  }

  let orderBy = desc(posts.createdAt);
  if (sortBy === "Oldest") {
    orderBy = asc(posts.createdAt);
  } else if (sortBy === "Most Liked") {
    orderBy = desc(posts.likes);
  } else if (sortBy === "Most Viewed") {
    orderBy = desc(posts.views);
  }

  const dbPosts = await db
    .select({
      post: posts,
      author: users,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(...whereConditions))
    .orderBy(orderBy);

  const mappedPosts: BlogPost[] = dbPosts.map(({ post, author }, index) => ({
    id: post.id,
    title: post.title,
    description: post.content.substring(0, 150) + "...",
    author: author?.name || "Unknown Author",
    authorId: author?.id || "unknown",
    role: author?.role || "Contributor",
    avatarSeed: author?.image || author?.name || "User",
    tags: [
      {
        label: `#${post.category || "General"}`,
        color: "bg-blue-50 text-blue-600 border-blue-100",
      },
    ],
    gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
    delay: `${(index + 1) * 0.1}s`,
  }));

  return (
    <>
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <BlogHeader />
        <BlogGrid posts={mappedPosts} />
      </main>
    </>
  );
}
