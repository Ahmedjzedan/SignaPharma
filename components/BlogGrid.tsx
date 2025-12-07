"use client";

import Link from "next/link";
import BlogCard from "./BlogCard";

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  role: string;
  avatarSeed: string;
  tags: { label: string; color: string }[];
  gradient: string;
  delay: string;
  className?: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.id}`}>
          <BlogCard {...post} />
        </Link>
      ))}
    </div>
  );
}
