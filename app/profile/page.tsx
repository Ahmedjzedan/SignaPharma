import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, savedDrugs, posts } from "@/lib/db/schema";
import { eq, count, sum } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProfileClientPage from "./ProfileClientPage";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) redirect("/auth");

  const savedCount = await db
    .select({ count: count() })
    .from(savedDrugs)
    .where(eq(savedDrugs.userId, user.id));

  const postStats = await db
    .select({ 
      count: count(),
      likes: sum(posts.likes)
    })
    .from(posts)
    .where(eq(posts.authorId, user.id));

  const stats = {
    collected: savedCount[0].count,
    elo: user.elo || 1500, 
    streak: user.streak || 0,
    blogs: postStats[0].count,
    likes: Number(postStats[0].likes) || 0,
  };

  const pinnedTrophies = user.pinnedTrophies ? JSON.parse(user.pinnedTrophies) : [];

  return (
    <ProfileClientPage 
      user={{
        name: user.name || "User",
        title: user.bio ? "Pharmacist" : "Student", // Fallback
        location: "Unknown", // Not in DB
        bio: user.bio || "No bio yet.",
        avatar: user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=House",
        level: Math.floor((user.xp || 0) / 1000) + 1,
        xp: user.xp || 0,
        maxXp: (Math.floor((user.xp || 0) / 1000) + 1) * 1000,
        rank: user.rank || "Novice",
        joinedAt: user.createdAt ? user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "December 2025",
        linkedin: user.linkedin || "",
        github: user.github || "",
        instagram: user.instagram || "",
        telegram: user.telegram || "",
      }}
      stats={stats}
      pinnedTrophies={pinnedTrophies}
    />
  );
}
