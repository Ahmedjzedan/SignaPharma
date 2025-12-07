"use server";

import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addComment(postId: string, content: string, parentId?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!content.trim()) {
    throw new Error("Comment cannot be empty");
  }

  await db.insert(comments).values({
    id: crypto.randomUUID(),
    postId,
    authorId: session.user.id,
    parentId,
    content,
    createdAt: new Date(),
  });

  revalidatePath(`/blog/${postId}`);
}
