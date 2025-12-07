import Navbar from "../../../components/Navbar";
import BlogPostHeader from "../../../components/BlogPostHeader";
import BlogPostContent from "../../../components/BlogPostContent";
import BlogPostComments from "../../../components/BlogPostComments";
import Footer from "../../../components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Why "Clinical Judgement" is Just Fancy Guessing | SignaPharma',
  description: "We pretend it's evidence-based, but half the time we're just vibing with the pharmacokinetics.",
};

export default function BlogPostPage() {
  const post = {
    title: 'Why "Clinical Judgement" is Just Fancy Guessing',
    author: "Dr. Sarah Jenks",
    role: "Clinical Specialist",
    date: "Feb 28, 2025",
    readTime: "4 min read",
    views: "1.2k views",
    avatarSeed: "Felix",
    tags: [
      { label: "#Rant", color: "bg-red-50 text-red-600 border-red-100" },
      { label: "#Clinical", color: "bg-blue-50 text-blue-600 border-blue-100" },
    ],
    gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-28 pb-20 animate-fade-in">
        <BlogPostHeader {...post} />
        <BlogPostContent />
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPostComments />
        </article>
      </main>
      <Footer />
    </>
  );
}
