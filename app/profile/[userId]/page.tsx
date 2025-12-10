import { db } from "@/lib/db";
import { users, savedDrugs, posts } from "@/lib/db/schema";
import { eq, count, sum } from "drizzle-orm";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileStats from "@/components/ProfileStats";
import TrophyCase from "@/components/TrophyCase";

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    notFound();
  }

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

  const profileUser = {
    name: user.name || "User",
    title: user.bio ? "Pharmacist" : "Student", // Fallback logic
    location: "Unknown", // Not in DB
    bio: user.bio || "No bio yet.",
    avatar: user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=House",
    level: Math.floor((user.xp || 0) / 1000) + 1,
    xp: user.xp || 0,
    maxXp: (Math.floor((user.xp || 0) / 1000) + 1) * 1000,
    rank: user.rank || "Novice",
    joinedAt: user.createdAt ? user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "December 2025",
    linkedin: user.linkedin || undefined,
    github: user.github || undefined,
    instagram: user.instagram || undefined,
    telegram: user.telegram || undefined,
  };

  return (
    <>
      <Navbar />
      <main className="grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ProfileHeader 
          user={profileUser} 
          isOwnProfile={false} 
        />
        <ProfileStats stats={stats} />
        <TrophyCase pinnedTrophies={pinnedTrophies} stats={stats} userLevel={profileUser.level} />
      </main>
      <Footer />
    </>
  );
}
