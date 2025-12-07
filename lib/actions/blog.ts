"use server";

import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const category = formData.get("category") as string;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  await db.insert(posts).values({
    id: crypto.randomUUID(),
    authorId: session.user.id,
    title,
    content,
    imageUrl: imageUrl || null,
    category: category || "General",
    likes: 0,
    createdAt: new Date(),
  });

  revalidatePath("/blog");
  redirect("/blog");
}
