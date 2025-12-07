import Navbar from "../../components/Navbar";
import BlogHeader from "../../components/BlogHeader";
import BlogGrid, { BlogPost } from "../../components/BlogGrid";
import Footer from "../../components/Footer";
import BlogSubNav from "../../components/BlogSubNav";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "SignaPharma | Community Blog",
  description: "Rants, clinical pearls, and survival guides.",
};

export default async function BlogPage() {
  const dbPosts = await db
    .select({
      post: posts,
      author: users,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id));

  const mappedPosts: BlogPost[] = dbPosts.map(({ post, author }, index) => ({
    id: post.id,
    title: post.title,
    description: post.content.substring(0, 150) + "...",
    author: author?.name || "Unknown Author",
    role: author?.role || "Contributor",
    avatarSeed: author?.name || "User",
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
      <Navbar />
      <BlogSubNav />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <BlogHeader />
        <BlogGrid posts={mappedPosts} />
      </main>
      <Footer />
    </>
  );
}
