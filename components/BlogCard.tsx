import clsx from "clsx";

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  role: string;
  avatarSeed: string;
  tags: { label: string; color: string }[];
  gradient: string;
  delay: string;
  onClick?: () => void;
  className?: string;
}

function stripMarkdown(text: string) {
  return text
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Keep link text
    .replace(/[*_`#]/g, '') // Remove special chars
    .replace(/>\s*/g, '') // Remove blockquotes
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
}

export default function BlogCard({
  title,
  description,
  author,
  role,
  avatarSeed,
  tags,
  gradient,
  delay,
  onClick,
  className,
}: BlogCardProps) {
  return (
    <article
      onClick={onClick}
      className={clsx(
        "group flex flex-col bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden h-full cursor-pointer hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:-translate-y-1 animate-slide-up",
        className
      )}
      style={{ animationDelay: delay }}
    >
      {/* Image/Gradient Placeholder */}
      <div className={clsx("h-48 relative overflow-hidden", gradient)}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        {/* Optional "Today" badge if needed, can be passed as prop later */}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={clsx(
                "px-2 py-0.5 rounded-full text-xs font-semibold border",
                tag.color
              )}
            >
              {tag.label}
            </span>
          ))}
        </div>

        <h2 className="text-xl font-bold text-card-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h2>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
          {stripMarkdown(description)}
        </p>

        {/* Footer: Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
              alt="Author"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-card-foreground">{author}</p>
            <p className="text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
