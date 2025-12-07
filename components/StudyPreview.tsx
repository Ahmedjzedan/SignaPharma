import Link from "next/link";
import { BookOpen, Brain, Trophy, ArrowRight } from "lucide-react";

export default function StudyPreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background -z-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium">
              <Brain className="w-4 h-4" />
              <span>New Feature</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Master Pharmacy <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                One Module at a Time
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Stop drowning in textbooks. Our interactive study modules break down complex topics into bite-sized, memorable lessons designed for retention.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: BookOpen, text: "Comprehensive subject coverage" },
                { icon: Brain, text: "Spaced repetition algorithms" },
                { icon: Trophy, text: "Gamified progress tracking" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-sm text-blue-600">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Link
                href="/study"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20"
              >
                Start Studying Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Right Column: Visual */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Abstract shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse-slow" />
            
            {/* Glass Card Mockup */}
            <div className="relative w-full max-w-md bg-card/80 backdrop-blur-md rounded-2xl p-6 md:p-8 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 border border-border shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Cardiology</h3>
                    <p className="text-sm text-muted-foreground">32 Topics • 85% Complete</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-bold text-foreground">A+</span>
                  <span className="text-xs text-muted-foreground font-medium">Current Grade</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-blue-500 rounded-full" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">28/32 Modules</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  "Hypertension Management",
                  "Heart Failure Guidelines",
                  "Antiarrhythmic Drugs",
                ].map((topic, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-foreground">{topic}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="text-blue-600 font-medium">Next up:</span> Acute Coronary Syndromes
                </p>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-xl animate-float border border-border">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-foreground">Streak: 7 Days!</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
