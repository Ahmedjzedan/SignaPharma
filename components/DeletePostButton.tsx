"use client";

import { Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions/content";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeletePostButtonProps {
  postId: string;
  className?: string;
}

export default function DeletePostButton({ postId, className }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

    setIsDeleting(true);
    const result = await deletePost(postId);
    
    if (result.success) {
      router.push("/blog");
      router.refresh();
    } else {
      alert("Failed to delete post");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors ${className}`}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      {isDeleting ? "Deleting..." : "Delete Post"}
    </button>
  );
}
