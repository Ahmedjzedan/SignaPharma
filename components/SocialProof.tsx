import { UserCheck, Zap } from "lucide-react";

export default function SocialProof() {
  return (
    <div className="w-full bg-slate-900 py-6 overflow-hidden border-y border-slate-800">
      <div className="flex w-[200%] animate-scroll-left hover:[animation-play-state:paused]">
        {/* Content Block 1 */}
        <div className="flex items-center justify-around w-1/2 min-w-[50%] gap-8 px-8">
          <span className="text-slate-400 font-semibold text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-medical-500" /> 10,000+
            Pharmacists Joined
          </span>
          <span className="text-slate-500 text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-lg flex items-center gap-2">
            "Finally, a UI that doesn't suck" — Reddit User
          </span>
          <span className="text-slate-500 text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> 98% Pass Rate
          </span>
          <span className="text-slate-500 text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-lg flex items-center gap-2">
            "Better than my professor" — PharmD Student
          </span>
        </div>
        {/* Content Block 2 (Duplicate for smooth loop) */}
        <div className="flex items-center justify-around w-1/2 min-w-[50%] gap-8 px-8">
          <span className="text-slate-400 font-semibold text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-medical-500" /> 10,000+
            Pharmacists Joined
          </span>
          <span className="text-slate-500 text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-lg flex items-center gap-2">
            "Finally, a UI that doesn't suck" — Reddit User
          </span>
          <span className="text-slate-500 text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> 98% Pass Rate
          </span>
          <span className="text-slate-500 text-2xl">•</span>
          <span className="text-slate-400 font-semibold text-lg flex items-center gap-2">
            "Better than my professor" — PharmD Student
          </span>
        </div>
      </div>
    </div>
  );
}
