import Link from "next/link";
import { Newspaper, Stethoscope, Library, ArrowRight } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Your Digital Arsenal
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to survive residency and retail hell.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Blog Card */}
          <Link
            href="/blog"
            className="block group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-medical-600/10 hover:border-medical-200 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-medical-600 transition-colors">
              <Newspaper className="w-7 h-7 text-medical-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Community Blog
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Knowledge sharing without the ego. Read the latest on guidelines,
              industry shifts, and why the printer is always broken.
            </p>
            <div className="mt-6 flex items-center text-medical-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              Read Articles <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Cases Card */}
          <Link
            href="/cases"
            className="block group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-medical-600/10 hover:border-medical-200 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
              <Stethoscope className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Clinical Cases
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Real-world scenarios with a sarcastic twist. Test your knowledge
              against patients who think WebMD is a medical degree.
            </p>
            <div className="mt-6 flex items-center text-purple-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              Solve Cases <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Library Card */}
          <Link
            href="/library"
            className="block group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-medical-600/10 hover:border-medical-200 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors">
              <Library className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Drug Library
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Build your digital drug cabinet. Save your favorite monographs and
              interaction checkers. It&apos;s like Pokémon, but for drugs.
            </p>
            <div className="mt-6 flex items-center text-teal-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              Browse DB <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
