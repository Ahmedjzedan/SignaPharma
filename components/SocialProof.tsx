import { UserCheck, Zap } from "lucide-react";

export default function SocialProof() {
  return (
    <div className="w-full bg-muted/50 py-6 overflow-hidden border-y border-border">
      <div className="flex w-max animate-scroll-left gap-16">
        {/* Content Block 1 */}
        <div className="flex items-center gap-8 px-4 flex-shrink-0">
          <span className="text-muted-foreground font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> 10,000+
            Pharmacists Joined
          </span>
          <span className="text-muted-foreground/50 text-xl sm:text-2xl">•</span>
          <span className="text-muted-foreground font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            &quot;Finally, a UI that doesn&apos;t suck&quot; — Reddit User
          </span>
          <span className="text-muted-foreground/50 text-xl sm:text-2xl">•</span>
          <span className="text-muted-foreground font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" /> 98% Pass Rate
          </span>
          <span className="text-muted-foreground/50 text-xl sm:text-2xl">•</span>
          <span className="text-muted-foreground font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            &quot;Better than my professor&quot; — PharmD Student
          </span>
        </div>
        {/* Content Block 2 (Duplicate for smooth loop) */}
        <div className="flex items-center gap-8 px-4 flex-shrink-0">
          <span className="text-muted-foreground font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> 10,000+
            Pharmacists Joined
          </span>
          <span className="text-muted-foreground/50 text-xl sm:text-2xl">•</span>
          <span className="text-muted-foreground font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            &quot;Finally, a UI that doesn&apos;t suck&quot; — Reddit User
          </span>
          <span className="text-muted-foreground/50 text-xl sm:text-2xl">•</span>
          <span className="text-muted-foreground font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" /> 98% Pass Rate
          </span>
          <span className="text-muted-foreground/50 text-xl sm:text-2xl">•</span>
          <span className="text-muted-foreground font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            &quot;Better than my professor&quot; — PharmD Student
          </span>
        </div>
      </div>
    </div>
  );
}
