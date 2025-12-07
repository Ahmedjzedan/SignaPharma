import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import EditBlogForm from "@/components/EditBlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  if (!post) {
    notFound();
  }

  if (post.authorId !== session.user.id) {
    redirect("/blog");
  }

  return (
    <>
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <EditBlogForm post={post} />
      </main>
    </>
  );
}
