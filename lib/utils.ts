import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripMarkdown(text: string) {
  if (!text) return "";
  return text
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Keep link text
    .replace(/[*_`#]/g, '') // Remove special chars
    .replace(/>\s*/g, '') // Remove blockquotes
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
}

export function getDrugColor(name: string): "blue" | "purple" | "green" | "orange" {
  const colors = ["blue", "purple", "green", "orange"] as const;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
