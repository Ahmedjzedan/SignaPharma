"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Code2, Database, Coffee, Terminal } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section - The Visionary Builder */}
        <div className="mb-20 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            The Pharmacist Who <span className="text-medical-600">Codes</span>
          </h1>
          <div className="prose prose-lg text-slate-600 max-w-3xl">
            <p>
              I’m a pharmacy student who realized that memorizing drug
              interactions is hard enough without fighting outdated software.
              While my peers were purely focused on clinical rotations, I was
              also deep in Next.js and SQL, looking for a better way to
              structure medical data.
            </p>
            <p>
              SignaPharma is the result of that collision. It’s built on a
              modern tech stack because I believe healthcare education deserves
              the same speed and efficiency as the apps we use every day. I
              built this platform to be the tool I wish I had—bridging the gap
              between complex pharmacology and intuitive design.
            </p>
          </div>
        </div>

        {/* Fun Facts Section - Sarcastic Gen Z */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start animate-slide-up">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-medical-600">
                <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Powered by Caffeine & Compilers
              </h2>
            </div>
            <div className="space-y-4 text-slate-600">
              <p>
                Hi, I’m the guy behind the code. By day, I’m a pharmacy student
                trying to decipher doctor handwriting. By night, I’m a
                Full-Stack Developer debugging database queries.
              </p>
              <p>
                Why build SignaPharma? Because I looked at the current state of
                pharmacy study tools and thought, &quot;I can fix this, or I can
                complain about it.&quot; I chose to fix it. I trade sleep for syntax
                to build tools that actually work for students like us.
              </p>
              <p className="font-medium text-medical-700">
                No cringe corporate speak here—just a pharmacy student using
                Tailwind and Type Safety to make sure you actually pass your
                boards.
              </p>
            </div>
          </div>

          {/* Quick Stats / Meet the Dev */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-medical-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-md">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
                  alt="Ahmed"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Ahmed</h3>
              <p className="text-sm font-bold text-medical-600 uppercase tracking-wider mb-6">
                Full-Stack Pharmacist
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-slate-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm">
                      The Stack
                    </strong>
                    <span className="text-sm text-slate-500">
                      Next.js, Tailwind CSS, SQLite/Turso, Drizzle ORM.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-slate-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm">
                      The Background
                    </strong>
                    <span className="text-sm text-slate-500">
                      Pharmacy Student (I know the pain of pharmacology).
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-slate-400">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm">
                      Current Status
                    </strong>
                    <span className="text-sm text-slate-500">
                      Likely over-caffeinated and debugging a race condition.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
