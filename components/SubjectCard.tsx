import { ArrowRight } from "lucide-react";
import clsx from "clsx";

interface SubjectCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  textClass: string;
  delay: string;
  onClick: (id: string) => void;
}

export default function SubjectCard({
  id,
  title,
  description,
  icon,
  colorClass,
  textClass,
  delay,
  onClick,
}: SubjectCardProps) {
  return (
    <div
      onClick={() => onClick(id)}
      className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:shadow-medical-600/10 hover:border-medical-200 transition-all duration-300 cursor-pointer animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div
        className={clsx(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300",
          colorClass
        )}
      >
        <div className={clsx("w-7 h-7", textClass)}>{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      <div
        className={clsx(
          "mt-6 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0",
          textClass
        )}
      >
        Select Subject <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
}
