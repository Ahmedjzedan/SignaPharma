"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileStats from "../../components/ProfileStats";
import TrophyCase from "../../components/TrophyCase";
import EditProfileModal from "../../components/EditProfileModal";

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Dr. Gregory House",
    title: "Clinical Pharmacist",
    location: "Princeton-Plainsboro",
    bio: "I solve puzzles. I don't talk to patients. It's not lupus.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=House",
    level: 12,
    xp: 2450,
    maxXp: 3000,
  });

  const [stats, setStats] = useState({
    collected: 42,
    elo: 1500,
    streak: 5,
  });

  useEffect(() => {
    const storedElo = localStorage.getItem("signapharma_elo");
    if (storedElo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStats((prev) => ({ ...prev, elo: parseInt(storedElo, 10) }));
    }
  }, []);

  const handleSaveProfile = (updatedUser: {
    name: string;
    title: string;
    bio: string;
  }) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ProfileHeader user={user} onEdit={() => setIsEditModalOpen(true)} />
        <ProfileStats stats={stats} />
        <TrophyCase />
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
