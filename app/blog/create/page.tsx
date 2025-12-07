"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createPost } from "@/lib/actions/blog";
import { PenTool, Image as ImageIcon, Tag, Type, AlignLeft, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-medical-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Publishing...
        </>
      ) : (
        <>
          <PenTool className="w-5 h-5" />
          Publish Post
        </>
      )}
    </button>
  );
}

export default function CreateBlogPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/50 shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-medical-100/50 rounded-full blur-3xl -mr-16 -mt-16 -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl -ml-16 -mb-16 -z-10" />

          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Create a New Post
            </h1>
            <p className="text-slate-600 max-w-lg mx-auto">
              Share your knowledge, rant about exams, or drop some study tips. 
              The floor is yours.
            </p>
          </div>

          <form action={createPost} className="space-y-8">
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-bold text-slate-700 ml-1">
                Title
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-medical-600 transition-colors">
                  <Type className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="e.g., How I survived Pharmacology II"
                  className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Category & Image URL Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-bold text-slate-700 ml-1">
                  Category
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-medical-600 transition-colors">
                    <Tag className="w-5 h-5" />
                  </div>
                  <select
                    name="category"
                    id="category"
                    className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all outline-none font-medium text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Study Tips">Study Tips</option>
                    <option value="Rant">Rant</option>
                    <option value="Clinical">Clinical</option>
                    <option value="News">News</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="block text-sm font-bold text-slate-700 ml-1">
                  Thumbnail URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-medical-600 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    name="imageUrl"
                    id="imageUrl"
                    placeholder="https://..."
                    className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-bold text-slate-700 ml-1">
                Content
              </label>
              <div className="relative group">
                <div className="absolute top-4 left-4 pointer-events-none text-slate-400 group-focus-within:text-medical-600 transition-colors">
                  <AlignLeft className="w-5 h-5" />
                </div>
                <textarea
                  name="content"
                  id="content"
                  required
                  rows={10}
                  placeholder="Write your masterpiece here..."
                  className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400 resize-y"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
