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
            Engineering Better <span className="text-primary">Healthcare Education</span>
          </h1>
          <div className="prose prose-lg text-muted-foreground max-w-3xl">
            <p>
              Memorizing drug interactions is difficult; fighting with outdated software makes it impossible. 
              SignaPharma was built on a simple premise: healthcare education should be as intuitive as the 
              consumer apps we use every day. By leveraging a modern tech stack, I’ve created a platform that 
              prioritizes user experience and data accessibility over rote memorization.
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
                About the Creator
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I’m Ahmed, a Pharmacy Student and Full-Stack Developer. I approach software development with 
                the same rigor required in clinical practice. SignaPharma isn't just a side project; it is a 
                purpose-built tool designed to solve specific pain points in pharmaceutical education.
              </p>
              <p className="font-medium text-primary">
                My goal is to build software that is clinically accurate, technically robust, and efficient.
              </p>
            </div>
          </div>

          {/* Quick Stats / Meet the Dev */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-muted mb-6 overflow-hidden border-4 border-background shadow-md">
                <img
                  src="/dr-house.png"
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
                      Built for performance and scalability using Next.js, Tailwind CSS, Turso (SQLite), and Drizzle ORM.
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
