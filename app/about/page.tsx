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
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
            The Pharmacist Who <span className="text-primary">Codes</span>
          </h1>
          <div className="prose prose-lg text-muted-foreground max-w-3xl">
            <p>
              I’m a pharmacy student who realized that memorizing drug
              interactions is hard enough without fighting software that looks like 
              it was built in 1998. Instead of actually studying for my exams, 
              I procrastinated by building this entire platform. It&apos;s basically a 
              very elaborate way to avoid reading my textbooks.
            </p>
            <p>
              SignaPharma is the result of excessive caffeine and a refusal to use 
              boring flashcards. It’s built on a modern tech stack because I believe 
              healthcare education shouldn&apos;t feel like a punishment. I built this 
              tool so I could learn pharmacology without falling asleep, and hopefully, 
              it helps you too.
            </p>
          </div>
        </div>

        {/* Fun Facts Section - Sarcastic Gen Z */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start animate-slide-up">
          <div className="bg-card rounded-3xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center shadow-sm text-primary">
                <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Powered by Caffeine & Compilers
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
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
              <p className="font-medium text-primary">
                No corporate buzzwords here. Just a pharmacy student who spent way 
                too much time centering divs instead of memorizing doses.
              </p>
            </div>
          </div>

          {/* Quick Stats / Meet the Dev */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-muted mb-6 overflow-hidden border-4 border-background shadow-md">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
                  alt="Ahmed"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">Ahmed</h3>
              <p className="text-sm font-bold text-primary uppercase tracking-wider mb-6">
                Full-Stack Pharmacist
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-muted-foreground">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-foreground text-sm">
                      The Stack
                    </strong>
                    <span className="text-sm text-muted-foreground">
                      Next.js, Tailwind CSS, SQLite/Turso, Drizzle ORM.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-muted-foreground">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-foreground text-sm">
                      The Background
                    </strong>
                    <span className="text-sm text-muted-foreground">
                      Pharmacy Student (I know the pain of pharmacology).
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-muted-foreground">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-foreground text-sm">
                      Current Status
                    </strong>
                    <span className="text-sm text-muted-foreground">
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
