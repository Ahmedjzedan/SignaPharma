"use server";

import { db } from "@/lib/db";
import { posts, cases, reports } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
  });

  if (!post) {
    return { success: false, message: "Post not found" };
  }

  const isAuthor = post.authorId === session.user.id;
  const isAdmin = session.user.role === "leader" || session.user.role === "co-leader";

  if (!isAuthor && !isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  await db.update(posts).set({ deletedAt: new Date() }).where(eq(posts.id, postId));
  revalidatePath("/blog");
  return { success: true, message: "Post deleted" };
}

export async function restorePost(postId: string) {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    return { success: false, message: "Unauthorized" };
  }

  await db.update(posts).set({ deletedAt: null }).where(eq(posts.id, postId));
  revalidatePath("/blog");
  return { success: true, message: "Post restored" };
}

export async function deleteCase(caseId: string) {
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const caseItem = await db.query.cases.findFirst({
    where: eq(cases.id, caseId),
  });

  if (!caseItem) {
    return { success: false, message: "Case not found" };
  }

  const isAuthor = caseItem.authorId === session.user.id;
  const isAdmin = session.user.role === "leader" || session.user.role === "co-leader";

  if (!isAuthor && !isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  await db.update(cases).set({ deletedAt: new Date() }).where(eq(cases.id, caseId));
  revalidatePath("/cases");
  return { success: true, message: "Case deleted" };
}

export async function restoreCase(caseId: string) {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    return { success: false, message: "Unauthorized" };
  }

  await db.update(cases).set({ deletedAt: null }).where(eq(cases.id, caseId));
  revalidatePath("/cases");
  return { success: true, message: "Case restored" };
}



export async function createCase(data: any) {
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const newCaseId = crypto.randomUUID();
    
    await db.insert(cases).values({
      id: newCaseId,
      authorId: session.user.id,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      category: data.category,
      patientData: JSON.stringify(data.patientData),
      scenario: JSON.stringify(data.scenario),
      quiz: JSON.stringify(data.quiz),
      status: 'pending', // Default to pending for review
      createdAt: new Date(),
    });

    revalidatePath("/admin/cases");
    return { success: true, message: "Case submitted for review" };
  } catch (error) {
    console.error("Failed to create case:", error);
    return { success: false, message: "Failed to create case" };
  }
}

export async function createReport(targetId: string, targetType: "blog" | "case" | "user" | "comment", reason: string) {
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  await db.insert(reports).values({
    reporterId: session.user.id,
    targetId,
    targetType,
    reason,
  });

  return { success: true, message: "Report submitted" };
}

export async function updateCase(caseId: string, data: Partial<typeof cases.$inferInsert>) {
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const caseItem = await db.query.cases.findFirst({
    where: eq(cases.id, caseId),
  });

  if (!caseItem) {
    return { success: false, message: "Case not found" };
  }

  const isAuthor = caseItem.authorId === session.user.id;
  const isAdmin = session.user.role === "leader" || session.user.role === "co-leader";

  if (!isAuthor && !isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  await db.update(cases).set(data).where(eq(cases.id, caseId));
  revalidatePath("/cases");
  revalidatePath("/admin/cases");
  return { success: true, message: "Case updated" };
}
