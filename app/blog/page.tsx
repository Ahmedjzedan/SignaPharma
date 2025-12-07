import Navbar from "../../components/Navbar";
import BlogHeader from "../../components/BlogHeader";
import BlogGrid from "../../components/BlogGrid";
import Footer from "../../components/Footer";
import BlogSubNav from "../../components/BlogSubNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignaPharma | Community Blog",
  description: "Rants, clinical pearls, and survival guides.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BlogSubNav />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <BlogHeader />
        <BlogGrid />
      </main>
      <Footer />
    </>
  );
}
