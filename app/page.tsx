import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SocialProof from "../components/SocialProof";
import StudyPreview from "../components/StudyPreview";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <SocialProof />
        <StudyPreview />
        <Features />
      </main>
      <Footer />
    </>
  );
}
