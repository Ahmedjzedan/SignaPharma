import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Edit, Trash2, Plus } from "lucide-react";
import { deletePost } from "@/app/actions/blog";
import { redirect } from "next/navigation";

import { stripMarkdown } from "@/lib/utils";

export default async function MyPostsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const userPosts = await db.query.posts.findMany({
    where: eq(posts.authorId, session.user.id),
    orderBy: [desc(posts.createdAt)],
  });

  return (
    <>
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Posts</h1>
            <p className="text-muted-foreground">
              Manage your contributions to the SignaPharma community.
            </p>
          </div>
          <Link
            href="/blog/create"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Create New Post
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userPosts.map((post) => (
            <article
              key={post.id}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link
                    href={`/blog/edit/${post.id}`}
                    className="p-2 bg-background/90 backdrop-blur-sm rounded-lg text-muted-foreground hover:text-primary transition-colors shadow-sm"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <form action={async () => {
                    "use server";
                    await deletePost(post.id);
                  }}>
                    <button
                      type="submit"
                      className="p-2 bg-background/90 backdrop-blur-sm rounded-lg text-muted-foreground hover:text-destructive transition-colors shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {post.category || "General"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown Date"}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                  {stripMarkdown(post.content).substring(0, 150)}...
                </p>

                <div className="pt-4 border-t border-border flex justify-between items-center">
                   <div className="flex items-center gap-4 text-sm text-muted-foreground">
                     <span>{post.likes || 0} Likes</span>
                   </div>
                   <Link 
                     href={`/blog/${post.id}`}
                     className="text-sm font-medium text-primary hover:text-primary/80"
                   >
                     Read More →
                   </Link>
                </div>
              </div>
            </article>
          ))}

          {userPosts.length === 0 && (
            <div className="col-span-full text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground mb-4">You haven't written any posts yet.</p>
              <Link
                href="/blog/create"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Start writing <Plus className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
