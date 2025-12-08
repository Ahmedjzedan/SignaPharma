"use client";

import { 
  Medal, Pin, Moon, Dna, HeartPulse, BookOpen, Lock, X, 
  Star, Zap, Award, Trophy, Target, Flame, PenTool, ThumbsUp, 
  MessageSquare, Users, Brain, Microscope, Pill, Stethoscope, 
  Syringe, Thermometer, Activity, Clipboard, FileText, GraduationCap, 
  Library, Search 
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { createPortal } from "react-dom";
import { togglePinTrophy } from "@/app/actions/profile";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: "yellow" | "green" | "red" | "blue" | "slate";
  isLocked?: boolean;
}

const badges: Badge[] = [
  // Existing & Fun
  {
    id: "1",
    name: "Night Shift Survivor",
    description: "3 nights w/o caffeine overdose",
    icon: <Moon className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />,
    color: "yellow",
  },
  {
    id: "2",
    name: "Bio Master",
    description: 'Correctly pronounced "Adalimumab"',
    icon: <Dna className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />,
    color: "green",
  },
  {
    id: "3",
    name: "Code Blue Hero",
    description: "Didn't faint during compressions",
    icon: <HeartPulse className="w-10 h-10 text-rose-600 dark:text-rose-400" />,
    color: "red",
  },
  {
    id: "4",
    name: "Walking Lexicomp",
    description: "Memorized 50 drugs",
    icon: <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
    color: "blue",
  },
  
  // Levels
  { id: "lvl-5", name: "Novice", description: "Reached Level 5", icon: <Star className="w-10 h-10 text-slate-500" />, color: "slate" },
  { id: "lvl-10", name: "Apprentice", description: "Reached Level 10", icon: <Star className="w-10 h-10 text-blue-500" />, color: "blue" },
  { id: "lvl-20", name: "Journeyman", description: "Reached Level 20", icon: <Star className="w-10 h-10 text-green-500" />, color: "green" },
  { id: "lvl-50", name: "Expert", description: "Reached Level 50", icon: <Star className="w-10 h-10 text-yellow-500" />, color: "yellow" },
  { id: "lvl-100", name: "Master", description: "Reached Level 100", icon: <Star className="w-10 h-10 text-rose-500" />, color: "red" },

  // Drugs Collected
  { id: "col-10", name: "Collector", description: "Collected 10 Drugs", icon: <Library className="w-10 h-10 text-slate-500" />, color: "slate" },
  { id: "col-50", name: "Librarian", description: "Collected 50 Drugs", icon: <Library className="w-10 h-10 text-blue-500" />, color: "blue" },
  { id: "col-100", name: "Pharmacologist", description: "Collected 100 Drugs", icon: <Library className="w-10 h-10 text-green-500" />, color: "green" },
  { id: "col-200", name: "Encyclopedia", description: "Collected 200 Drugs", icon: <Library className="w-10 h-10 text-yellow-500" />, color: "yellow" },
  { id: "col-500", name: "Drug Lord", description: "Collected 500 Drugs", icon: <Library className="w-10 h-10 text-rose-500" />, color: "red" },

  // ELO
  { id: "elo-1200", name: "Intern", description: "Reached 1200 ELO", icon: <Trophy className="w-10 h-10 text-slate-500" />, color: "slate" },
  { id: "elo-1500", name: "Resident", description: "Reached 1500 ELO", icon: <Trophy className="w-10 h-10 text-blue-500" />, color: "blue" },
  { id: "elo-1800", name: "Attending", description: "Reached 1800 ELO", icon: <Trophy className="w-10 h-10 text-green-500" />, color: "green" },
  { id: "elo-2000", name: "Chief", description: "Reached 2000 ELO", icon: <Trophy className="w-10 h-10 text-yellow-500" />, color: "yellow" },
  { id: "elo-2500", name: "Surgeon General", description: "Reached 2500 ELO", icon: <Trophy className="w-10 h-10 text-rose-500" />, color: "red" },

  // Study Streak
  { id: "str-3", name: "Focused", description: "3 Day Streak", icon: <Flame className="w-10 h-10 text-slate-500" />, color: "slate" },
  { id: "str-7", name: "Committed", description: "7 Day Streak", icon: <Flame className="w-10 h-10 text-blue-500" />, color: "blue" },
  { id: "str-30", name: "Dedicated", description: "30 Day Streak", icon: <Flame className="w-10 h-10 text-green-500" />, color: "green" },
  { id: "str-100", name: "Obsessed", description: "100 Day Streak", icon: <Flame className="w-10 h-10 text-yellow-500" />, color: "yellow" },
  { id: "str-365", name: "Unstoppable", description: "365 Day Streak", icon: <Flame className="w-10 h-10 text-rose-500" />, color: "red" },

  // Blogs Posted
  { id: "blg-1", name: "First Words", description: "Posted 1 Blog", icon: <PenTool className="w-10 h-10 text-slate-500" />, color: "slate" },
  { id: "blg-5", name: "Blogger", description: "Posted 5 Blogs", icon: <PenTool className="w-10 h-10 text-blue-500" />, color: "blue" },
  { id: "blg-10", name: "Columnist", description: "Posted 10 Blogs", icon: <PenTool className="w-10 h-10 text-green-500" />, color: "green" },
  { id: "blg-25", name: "Editor", description: "Posted 25 Blogs", icon: <PenTool className="w-10 h-10 text-yellow-500" />, color: "yellow" },
  { id: "blg-50", name: "Publisher", description: "Posted 50 Blogs", icon: <PenTool className="w-10 h-10 text-rose-500" />, color: "red" },

  // Blog Likes
  { id: "lik-10", name: "Noticed", description: "10 Likes on Blogs", icon: <ThumbsUp className="w-10 h-10 text-slate-500" />, color: "slate" },
  { id: "lik-50", name: "Liked", description: "50 Likes on Blogs", icon: <ThumbsUp className="w-10 h-10 text-blue-500" />, color: "blue" },
  { id: "lik-100", name: "Popular", description: "100 Likes on Blogs", icon: <ThumbsUp className="w-10 h-10 text-green-500" />, color: "green" },
  { id: "lik-500", name: "Trending", description: "500 Likes on Blogs", icon: <ThumbsUp className="w-10 h-10 text-yellow-500" />, color: "yellow" },
  { id: "lik-1000", name: "Viral", description: "1000 Likes on Blogs", icon: <ThumbsUp className="w-10 h-10 text-rose-500" />, color: "red" },

  // Misc
  { id: "quiz-10", name: "Quiz Master", description: "Perfect score on 10 quizzes", icon: <Target className="w-10 h-10 text-yellow-500" />, color: "yellow" },
  { id: "speed", name: "Speed Demon", description: "Finish quiz in < 1 min", icon: <Zap className="w-10 h-10 text-yellow-500" />, color: "yellow" },
  { id: "early", name: "Early Bird", description: "Study before 6 AM", icon: <Moon className="w-10 h-10 text-blue-500" />, color: "blue" },
  { id: "owl", name: "Night Owl", description: "Study after 12 AM", icon: <Moon className="w-10 h-10 text-slate-500" />, color: "slate" },
  { id: "social", name: "Social Butterfly", description: "Comment on 10 posts", icon: <MessageSquare className="w-10 h-10 text-green-500" />, color: "green" },
  { id: "beta", name: "Beta Tester", description: "Joined early", icon: <Microscope className="w-10 h-10 text-rose-500" />, color: "red" },
  { id: "pill", name: "Pill Popper", description: "Viewed 100 Pill Cards", icon: <Pill className="w-10 h-10 text-blue-500" />, color: "blue" },
  { id: "doc", name: "The Doctor", description: "Diagnosed 50 Cases", icon: <Stethoscope className="w-10 h-10 text-green-500" />, color: "green" },
  { id: "grad", name: "Valedictorian", description: "Top of the class", icon: <GraduationCap className="w-10 h-10 text-yellow-500" />, color: "yellow" },
  { id: "brain", name: "Big Brain", description: "1000 IQ Plays", icon: <Brain className="w-10 h-10 text-rose-500" />, color: "red" },
];

const colorMap = {
  yellow: {
    bg: "bg-yellow-100/50 dark:bg-yellow-900/20",
    ring: "ring-yellow-200 dark:ring-yellow-900/50 border-yellow-200 dark:border-yellow-800",
  },
  green: {
    bg: "bg-emerald-100/50 dark:bg-emerald-900/20",
    ring: "ring-emerald-200 dark:ring-emerald-900/50 border-emerald-200 dark:border-emerald-800",
  },
  red: {
    bg: "bg-rose-100/50 dark:bg-rose-900/20",
    ring: "ring-rose-200 dark:ring-rose-900/50 border-rose-200 dark:border-rose-800",
  },
  blue: {
    bg: "bg-blue-100/50 dark:bg-blue-900/20",
    ring: "ring-blue-200 dark:ring-blue-900/50 border-blue-200 dark:border-blue-800",
  },
  slate: {
    bg: "bg-muted",
    ring: "ring-transparent border-2 border-dashed border-muted-foreground/30",
  },
};

interface TrophyCaseProps {
  pinnedTrophies?: string[];
  stats: {
    collected: number;
    elo: number;
    streak: number;
    blogs: number;
    likes: number;
  };
  userLevel: number;
}

export default function TrophyCase({ pinnedTrophies = [], stats, userLevel }: TrophyCaseProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const checkUnlock = (badge: Badge) => {
    if (badge.isLocked) return false;
    if (["1", "2", "3", "4", "quiz-10", "speed", "early", "owl", "social", "beta", "pill", "doc", "grad", "brain"].includes(badge.id)) return true;

    const [type, val] = badge.id.split("-");
    const value = parseInt(val, 10);
    if (isNaN(value)) return true;

    switch (type) {
      case "lvl": return userLevel >= value;
      case "col": return stats.collected >= value;
      case "elo": return stats.elo >= value;
      case "str": return stats.streak >= value;
      case "blg": return stats.blogs >= value;
      case "lik": return stats.likes >= value;
      default: return true;
    }
  };

  const unlockedCount = badges.filter(b => checkUnlock(b)).length;

  const handlePin = async (id: string) => {
    const isPinned = pinnedTrophies.includes(id);
    
    if (!isPinned && pinnedTrophies.length >= 6) {
      setErrorMsg("You can only pin 6 trophies!");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    try {
      await togglePinTrophy(id);
      setErrorMsg(null);
    } catch (error) {
      console.error("Failed to toggle pin", error);
    }
  };

  const renderBadge = (badge: Badge, isModal = false) => {
    const styles = colorMap[badge.color];
    const isPinned = pinnedTrophies.includes(badge.id);
    const isLocked = !checkUnlock(badge);

    if (isLocked && !isPinned) {
      return (
        <div
          key={badge.id}
          className="flex flex-col items-center opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed"
        >
          <div
            className={clsx(
              "w-20 h-20 rounded-full flex items-center justify-center mb-3 ring-4 border",
              styles.bg,
              styles.ring
            )}
          >
            {badge.icon}
          </div>
          <span className="text-xs font-bold text-muted-foreground text-center">
            {badge.name}
          </span>
        </div>
      );
    }

    return (
      <div
        key={badge.id}
        className={clsx(
          "flex flex-col items-center group cursor-pointer relative",
          isLocked && "opacity-75 grayscale"
        )}
        onClick={() => isModal && handlePin(badge.id)}
      >
        {isPinned && (
          <div className="absolute top-0 right-2 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center z-10 shadow-sm animate-in zoom-in">
            <Pin className="w-2.5 h-2.5 text-primary-foreground fill-current" />
          </div>
        )}
        <div
          className={clsx(
            "w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300 ring-4 border has-tooltip",
            styles.bg,
            styles.ring,
            isPinned && "ring-primary/30 dark:ring-primary/30"
          )}
        >
          {badge.icon}
          <span className="tooltip">{badge.description}</span>
        </div>
        <span className="text-xs font-bold text-foreground text-center">
          {badge.name}
        </span>
      </div>
    );
  };

  // Sort: Pinned first, then unlocked, then locked
  const sortedBadges = [...badges].sort((a, b) => {
    const aPinned = pinnedTrophies.includes(a.id);
    const bPinned = pinnedTrophies.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  const displayBadges = sortedBadges.slice(0, 6);
  const pinnedBadgesList = badges.filter(b => pinnedTrophies.includes(b.id));
  const otherBadgesList = badges.filter(b => !pinnedTrophies.includes(b.id));

  return (
    <>
      <div
        className="bg-card rounded-3xl border border-border shadow-sm p-8 animate-slide-up overflow-visible"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
              <Medal className="w-5 h-5 text-primary" /> Trophy Case
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pin your top 5 achievements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-muted text-muted-foreground px-3 py-1 rounded-full">
              {unlockedCount} / {badges.length} Unlocked
            </span>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-full transition-colors"
            >
              View All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayBadges.map(b => renderBadge(b))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl animate-scale-in border border-border flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center bg-card z-10">
              <div>
                <h3 className="text-xl font-bold text-foreground">All Trophies</h3>
                {errorMsg && (
                  <p className="text-sm text-red-500 font-medium animate-pulse mt-1">
                    {errorMsg}
                  </p>
                )}
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar p-8">
              {/* Pinned Section */}
              {pinnedBadgesList.length > 0 && (
                <div className={clsx("mb-10 p-6 bg-muted/30 rounded-2xl border border-border/50 transition-transform", isShaking && "animate-shake")}>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Pin className="w-4 h-4" /> Pinned Collection ({pinnedBadgesList.length}/6)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-8">
                    {pinnedBadgesList.map(b => renderBadge(b, true))}
                  </div>
                </div>
              )}

              {/* Library Section */}
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
                  Trophy Library
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-8">
                  {otherBadgesList.map(b => renderBadge(b, true))}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 border-t border-border text-center text-sm text-muted-foreground">
              Click on a trophy to pin/unpin it.
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
