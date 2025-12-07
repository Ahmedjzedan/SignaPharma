'use server';

import { db } from '@/lib/db';
import { posts, postLikes, savedPosts, comments } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and, count, desc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function togglePostLike(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const existingLike = await db.query.postLikes.findFirst({
    where: and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)),
  });

  if (existingLike) {
    await db.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    await db.update(posts).set({ likes: sql`likes - 1` }).where(eq(posts.id, postId));
  } else {
    await db.insert(postLikes).values({
      postId,
      userId,
    });
    await db.update(posts).set({ likes: sql`likes + 1` }).where(eq(posts.id, postId));
  }

  revalidatePath(`/blog/${postId}`);
  revalidatePath('/blog');
}

export async function togglePostSave(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const existingSave = await db.query.savedPosts.findFirst({
    where: and(eq(savedPosts.postId, postId), eq(savedPosts.userId, userId)),
  });

  if (existingSave) {
    await db.delete(savedPosts).where(and(eq(savedPosts.postId, postId), eq(savedPosts.userId, userId)));
  } else {
    await db.insert(savedPosts).values({
      postId,
      userId,
    });
  }

  revalidatePath(`/blog/${postId}`);
  revalidatePath('/blog/saved');
}

export async function addComment(postId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  await db.insert(comments).values({
    id: crypto.randomUUID(),
    postId,
    authorId: session.user.id,
    content,
  });

  revalidatePath(`/blog/${postId}`);
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
  });

  if (!post || post.authorId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await db.delete(posts).where(eq(posts.id, postId));
  revalidatePath('/blog');
  revalidatePath('/my-posts');
}

export async function getPostStats(postId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  const [likesCount] = await db.select({ count: count() }).from(postLikes).where(eq(postLikes.postId, postId));
  
  let isLiked = false;
  let isSaved = false;

  if (userId) {
    const like = await db.query.postLikes.findFirst({
      where: and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)),
    });
    isLiked = !!like;

    const save = await db.query.savedPosts.findFirst({
      where: and(eq(savedPosts.postId, postId), eq(savedPosts.userId, userId)),
    });
    isSaved = !!save;
  }

  return {
    likes: likesCount.count,
    isLiked,
    isSaved,
  };
}

export async function incrementPostViews(postId: string) {
  await db.update(posts).set({ views: sql`views + 1` }).where(eq(posts.id, postId));
  revalidatePath(`/blog/${postId}`);
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  // Verify ownership
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
  });

  if (!post || post.authorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await db.update(posts)
    .set({
      title,
      content,
      category,
      imageUrl,
    })
    .where(eq(posts.id, postId));

  revalidatePath(`/blog/${postId}`);
  revalidatePath("/blog");
  revalidatePath("/my-posts");
  redirect(`/blog/${postId}`);
}
