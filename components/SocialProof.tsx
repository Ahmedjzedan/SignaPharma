import { UserCheck, Zap } from "lucide-react";

export default function SocialProof() {
  return (
    <div className="w-full bg-slate-900 py-6 overflow-hidden border-y border-slate-800">
      <div className="flex w-[200%] animate-scroll-left">
        {/* Content Block 1 */}
        <div className="flex items-center justify-around w-1/2 min-w-[50%] gap-4 sm:gap-8 px-4 sm:px-8">
          <span className="text-slate-400 font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-medical-500" /> 10,000+
            Pharmacists Joined
          </span>
          <span className="text-slate-500 text-xl sm:text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            &quot;Finally, a UI that doesn&apos;t suck&quot; — Reddit User
          </span>
          <span className="text-slate-500 text-xl sm:text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" /> 98% Pass Rate
          </span>
          <span className="text-slate-500 text-xl sm:text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            &quot;Better than my professor&quot; — PharmD Student
          </span>
        </div>
        {/* Content Block 2 (Duplicate for smooth loop) */}
        <div className="flex items-center justify-around w-1/2 min-w-[50%] gap-4 sm:gap-8 px-4 sm:px-8">
          <span className="text-slate-400 font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-medical-500" /> 10,000+
            Pharmacists Joined
          </span>
          <span className="text-slate-500 text-xl sm:text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            &quot;Finally, a UI that doesn&apos;t suck&quot; — Reddit User
          </span>
          <span className="text-slate-500 text-xl sm:text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" /> 98% Pass Rate
          </span>
          <span className="text-slate-500 text-xl sm:text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-sm sm:text-lg flex items-center gap-2 whitespace-nowrap">
            &quot;Better than my professor&quot; — PharmD Student
          </span>
        </div>
      </div>
    </div>
  );
}
