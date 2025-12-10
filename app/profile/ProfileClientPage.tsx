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
