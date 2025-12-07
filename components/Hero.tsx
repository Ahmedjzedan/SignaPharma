import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}


        {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Don&apos;t just memorize. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-teal-500">
              Master the meds.
            </span>
          </h1>

        {/* Subheadline */}
        <p className="mt-4 text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            The all-in-one platform for pharmacy students who want to crush their
            exams and actually understand what they&apos;re dispensing.
          </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/study"
            className="px-8 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-semibold text-lg shadow-xl shadow-medical-600/30 transition-all transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2"
          >
            Start Studying
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Tech Stack Hint (For the Dev user) */}
        <p className="mt-8 text-xs text-slate-400 font-mono">
          Powered by Caffeine & Drizzle ORM
        </p>
      </div>
    </section>
  );
}
