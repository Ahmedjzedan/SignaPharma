"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name: string;
  title?: string;
  bio: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  telegram?: string;
  avatar?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  if (data.linkedin && !data.linkedin.match(/^https:\/\/(www\.)?linkedin\.com\/.*$/)) {
    throw new Error("Invalid LinkedIn URL");
  }
  if (data.github && !data.github.match(/^https:\/\/(www\.)?github\.com\/.*$/)) {
    throw new Error("Invalid GitHub URL");
  }
  if (data.instagram && !data.instagram.match(/^https:\/\/(www\.)?instagram\.com\/.*$/)) {
    throw new Error("Invalid Instagram URL");
  }
  if (data.telegram && !data.telegram.match(/^https:\/\/(t\.me|telegram\.me)\/.*$/)) {
    throw new Error("Invalid Telegram URL");
  }

  await db
    .update(users)
    .set({
      name: data.name,
      bio: data.bio,
      image: data.avatar,
      linkedin: data.linkedin,
      github: data.github,
      instagram: data.instagram,
      telegram: data.telegram,
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/profile");
}

export async function togglePinTrophy(trophyId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) throw new Error("User not found");

  let pinned = user.pinnedTrophies ? JSON.parse(user.pinnedTrophies) : [];
  
  if (pinned.includes(trophyId)) {
    pinned = pinned.filter((id: string) => id !== trophyId);
  } else {
    if (pinned.length >= 6) {
      throw new Error("Max 6 trophies pinned");
    }
    pinned.push(trophyId);
  }

  await db
    .update(users)
    .set({
      pinnedTrophies: JSON.stringify(pinned),
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/profile");
}

export async function updateUserStats(data: { eloChange?: number; incrementStreak?: boolean }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) throw new Error("User not found");

  const updates: Partial<typeof users.$inferSelect> = {};

  // ELO Update
  if (data.eloChange !== undefined) {
    updates.elo = (user.elo || 1500) + data.eloChange;
  }

  // Streak Update
  if (data.incrementStreak) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastDate = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    if (!lastDate) {
      // First time
      updates.streak = 1;
      updates.lastStudyDate = new Date();
    } else if (lastDate.getTime() === today.getTime()) {
      // Already studied today, do nothing
    } else if (today.getTime() - lastDate.getTime() === 86400000) {
      // Consecutive day
      updates.streak = (user.streak || 0) + 1;
      updates.lastStudyDate = new Date();
    } else {
      // Broken streak
      updates.streak = 1;
      updates.lastStudyDate = new Date();
    }
  }

  if (Object.keys(updates).length > 0) {
    await db.update(users).set(updates).where(eq(users.id, user.id));
    revalidatePath("/profile");
  }
}
