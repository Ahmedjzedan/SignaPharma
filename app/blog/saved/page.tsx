"use client";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import BlogSubNav from "../../../components/BlogSubNav";
import SavedRantsGrid from "../../../components/SavedRantsGrid";
import { Filter } from "lucide-react";

export default function SavedRantsPage() {
  return (
    <>
      <Navbar />
      <BlogSubNav />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">Saved Rants</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                3 Items
              </span>
            </div>
            <p className="text-slate-500">
              Articles you promised yourself you&apos;d read &quot;when you have time.&quot;
              (Spoiler: You won&apos;t).
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-medical-500 hover:text-medical-600 transition-all text-sm font-medium">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <SavedRantsGrid />
      </main>
      <Footer />
    </>
  );
}
