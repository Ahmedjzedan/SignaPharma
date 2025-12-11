"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileStats from "../../components/ProfileStats";
import TrophyCase from "../../components/TrophyCase";
import EditProfileModal from "../../components/EditProfileModal";
import { updateProfile } from "@/app/actions/profile";

interface User {
  name: string;
  title: string;
  location: string;
  bio: string;
  avatar: string;
  level: number;
  xp: number;
  maxXp: number;
  rank: string;
  joinedAt: string;
  linkedin: string;
  github: string;
  instagram: string;
  telegram: string;
  scientificBackground: string;
}

interface Stats {
  collected: number;
  elo: number;
  streak: number;
  blogs: number;
  likes: number;
}

interface ProfileClientPageProps {
  user: User;
  stats: Stats;
  pinnedTrophies: string[];
}

export default function ProfileClientPage({ user: initialUser, stats, pinnedTrophies }: ProfileClientPageProps) {
  const [user, setUser] = useState(initialUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // We can use local state for optimistic updates if needed, but for now relying on revalidatePath in server action
  // However, EditProfileModal expects a local handler. We should wrap the server action.

  const handleSaveProfile = async (updatedUser: {
    name: string;
    title: string;
    bio: string;
    linkedin: string;
    github: string;
    instagram: string;
    telegram: string;
    avatar: string;
  }) => {
    try {
      await updateProfile({
        name: updatedUser.name,
        bio: updatedUser.bio,
        linkedin: updatedUser.linkedin,
        github: updatedUser.github,
        instagram: updatedUser.instagram,
        telegram: updatedUser.telegram,
        avatar: updatedUser.avatar,
      });
      // Optimistic update
      setUser({ ...user, ...updatedUser });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ProfileHeader user={user} onEdit={() => setIsEditModalOpen(true)} isOwnProfile={true} />
        <ProfileStats stats={stats} />
        <TrophyCase pinnedTrophies={pinnedTrophies} stats={stats} userLevel={user.level} />
        
        {/* Hidden Section for Owner */}
        <div className="mt-12 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <span className="text-xs font-mono uppercase tracking-widest">Hidden Settings (Owner Only)</span>
          </div>
          
          <h3 className="text-lg font-bold mb-4">Scientific Background</h3>
          <p className="text-sm text-muted-foreground mb-6">
            This helps us tailor the complexity of clinical cases for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={async () => {
                try {
                  await import("@/app/actions/onboarding").then(mod => mod.updateScientificBackground("Layperson"));
                  setUser({ ...user, scientificBackground: "Layperson" });
                } catch (err) {
                  console.error(err);
                }
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                user.scientificBackground === "Layperson"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="font-bold text-foreground">General Interest</div>
              <div className="text-sm text-muted-foreground">I'm curious about medicine but not a professional.</div>
            </button>

            <button
              onClick={async () => {
                try {
                  await import("@/app/actions/onboarding").then(mod => mod.updateScientificBackground("Professional"));
                  setUser({ ...user, scientificBackground: "Professional" });
                } catch (err) {
                  console.error(err);
                }
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                user.scientificBackground !== "Layperson"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="font-bold text-foreground">Healthcare World</div>
              <div className="text-sm text-muted-foreground">I'm a student, pharmacist, nurse, or doctor.</div>
            </button>
          </div>
        </div>
      </main>
      <Footer />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </>
  );
}
