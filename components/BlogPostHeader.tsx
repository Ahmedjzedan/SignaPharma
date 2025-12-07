import Link from "next/link";
import { ArrowLeft, Clock, Eye } from "lucide-react";

interface BlogPostHeaderProps {
  title: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  views: string;
  avatarSeed: string;
  tags: { label: string; color: string }[];
  gradient: string;
}

export default function BlogPostHeader({
  title,
  author,
  role,
  date,
  readTime,
  views,
  avatarSeed,
  tags,
  gradient,
  isAuthor,
  postId,
}: BlogPostHeaderProps & { isAuthor?: boolean; postId?: string }) {
  return (
    <>
      {/* Back Navigation */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between">
        <Link
          href="/blog"
          className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Rants
        </Link>

        {isAuthor && postId && (
          <Link
            href={`/blog/edit/${postId}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-medical-600 bg-medical-50 hover:bg-medical-100 rounded-lg transition-colors"
          >
            Edit Post
          </Link>
        )}
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-bold border ${tag.color}`}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-6">
            {title}
          </h1>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Link href={`/profile/${author}`} className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden ring-2 ring-background shadow-sm group-hover:ring-primary transition-all">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                    alt="Author"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">{author}</p>
                  <p className="text-sm text-muted-foreground">
                    {role} • {date}
                  </p>
                </div>
              </Link>
            <div className="hidden sm:block h-10 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {views}
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-xl shadow-indigo-500/10 mb-10 border border-border">
          <div className={`h-64 sm:h-80 w-full relative ${gradient}`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white/80 text-xs text-center sm:text-right font-mono">
              Visual representation of my brain on night shift.
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
