"use client";

import Link from "next/link";
import BlogCard from "./BlogCard";

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Why "Clinical Judgement" is Just Fancy Guessing',
    description:
      "We pretend it's evidence-based, but half the time we're just vibing with the pharmacokinetics. Let's discuss the art of the educated guess.",
    author: "Dr. Sarah Jenks",
    role: "Clinical Specialist",
    avatarSeed: "Felix",
    tags: [
      { label: "#Rant", color: "bg-red-50 text-red-600 border-red-100" },
      { label: "#Clinical", color: "bg-blue-50 text-blue-600 border-blue-100" },
    ],
    gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
    delay: "0.1s",
  },
  {
    id: 2,
    title: "2025 Hypertension Guidelines: Salt is Back?",
    description:
      "Just kidding. But the new beta-blocker positioning is actually interesting. Here's the TL;DR so you don't have to read 80 pages.",
    author: "Mike Ross, PharmD",
    role: "Residency Survivor",
    avatarSeed: "Mason",
    tags: [
      {
        label: "#Guidelines",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      },
      {
        label: "#Study",
        color: "bg-slate-100 text-slate-600 border-slate-200",
      },
    ],
    gradient: "bg-gradient-to-br from-emerald-400 to-cyan-600",
    delay: "0.2s",
  },
  {
    id: 3,
    title: "Night Shift Survival Guide: Caffeine & Spite",
    description:
      "How to maintain a circadian rhythm when your body thinks it's dying. Step 1: Buy blackout curtains.",
    author: "Jess Chen",
    role: "Night Ops",
    avatarSeed: "Jessica",
    tags: [
      {
        label: "#Lifestyle",
        color: "bg-amber-50 text-amber-600 border-amber-100",
      },
      {
        label: "#Coffee",
        color: "bg-slate-100 text-slate-600 border-slate-200",
      },
    ],
    gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
    delay: "0.3s",
  },
  {
    id: 4,
    title: "Retail to Industry: The Escape Plan",
    description:
      "Thinking about selling out? Here is how to tailor your CV so Big Pharma actually reads it.",
    author: "Alex V.",
    role: "Medical Liaison",
    avatarSeed: "Alex",
    tags: [
      {
        label: "#Career",
        color: "bg-purple-50 text-purple-600 border-purple-100",
      },
    ],
    gradient: "bg-gradient-to-br from-slate-700 to-slate-900",
    delay: "0.4s",
    className: "hidden md:block",
  },
];

export default function BlogGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {BLOG_POSTS.map((post) => (
        <Link key={post.id} href={`/blog/${post.id}`}>
          <BlogCard {...post} />
        </Link>
      ))}
    </div>
  );
}
