"use server";

import { db } from "@/lib/db";
import { users, reports, cases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function promoteUser(targetUserId: string, newRole: "leader" | "co-leader" | "member") {
  const session = await auth();
  if (!session || session.user.role !== "leader") {
    return { success: false, message: "Unauthorized" };
  }

  await db.update(users).set({ role: newRole }).where(eq(users.id, targetUserId));
  revalidatePath(`/profile/${targetUserId}`);
  return { success: true, message: "User promoted successfully" };
}

export async function banUser(targetUserId: string) {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    return { success: false, message: "Unauthorized" };
  }

  // Prevent banning other leaders
  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, targetUserId),
  });

  if (targetUser?.role === "leader") {
     return { success: false, message: "Cannot ban a leader" };
  }

  await db.update(users).set({ isBanned: true }).where(eq(users.id, targetUserId));
  revalidatePath(`/profile/${targetUserId}`);
  return { success: true, message: "User banned successfully" };
}

export async function resolveReport(reportId: string, action: "resolved" | "dismissed") {
    const session = await auth();
    if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
      return { success: false, message: "Unauthorized" };
    }

    await db.update(reports).set({ status: action }).where(eq(reports.id, reportId));
    revalidatePath("/admin/reports");
    return { success: true, message: "Report updated" };
}

export async function reviewCase(caseId: string, status: "approved" | "rejected") {
    const session = await auth();
    if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
      return { success: false, message: "Unauthorized" };
    }

    await db.update(cases).set({ status: status }).where(eq(cases.id, caseId));
    revalidatePath("/admin/cases");
    return { success: true, message: "Case updated" };
}

export async function unbanUser(targetUserId: string) {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    return { success: false, message: "Unauthorized" };
  }

  await db.update(users).set({ isBanned: false }).where(eq(users.id, targetUserId));
  revalidatePath(`/profile/${targetUserId}`);
  revalidatePath("/admin/users");
  return { success: true, message: "User unbanned successfully" };
}

export async function demoteUser(targetUserId: string) {
  const session = await auth();
  if (!session || session.user.role !== "leader") {
    return { success: false, message: "Unauthorized" };
  }

  // Verify target is actually a co-leader or leader?
  // Just setting to member is fine.
  await db.update(users).set({ role: "member" }).where(eq(users.id, targetUserId));
  revalidatePath(`/profile/${targetUserId}`);
  revalidatePath("/admin/users");
  return { success: true, message: "User demoted successfully" };
}

import { deletePost, deleteCase } from "@/app/actions/content";

export async function deleteContentAndResolve(reportId: string, targetId: string, targetType: string) {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    if (targetType === "blog") {
      await deletePost(targetId);
    } else if (targetType === "case") {
      await deleteCase(targetId);
    }
    
    // If target is user, we don't delete the user here, just resolve. 
    // Banning is a separate action.

    await db.update(reports).set({ status: "resolved" }).where(eq(reports.id, reportId));
    revalidatePath("/admin/reports");
    return { success: true, message: "Content deleted and report resolved" };
  } catch (error) {
    console.error("Failed to delete content:", error);
    return { success: false, message: "Failed to delete content" };
  }
}

import { restorePost, restoreCase } from "@/app/actions/content";

export async function restoreContentAndRevert(reportId: string, targetId: string, targetType: string) {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    if (targetType === "blog") {
      await restorePost(targetId);
    } else if (targetType === "case") {
      await restoreCase(targetId);
    }

    // Set report back to pending? Or keep as resolved but content restored?
    // User asked to "revert the resolve or actions". 
    // Reverting resolve means setting back to pending.
    
    await db.update(reports).set({ status: "pending" }).where(eq(reports.id, reportId));
    revalidatePath("/admin/reports");
    return { success: true, message: "Content restored and report reverted" };
  } catch (error) {
    console.error("Failed to restore content:", error);
    return { success: false, message: "Failed to restore content" };
  }
}
