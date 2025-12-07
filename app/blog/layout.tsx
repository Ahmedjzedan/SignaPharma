import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSubNav from "@/components/BlogSubNav";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <BlogSubNav />
      {children}
      <Footer />
    </>
  );
}
