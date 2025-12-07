"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import StudyHeader from "../../components/StudyHeader";
import SubjectCard from "../../components/SubjectCard";
import SubjectModal from "../../components/SubjectModal";
import {
  FlaskConical,
  Stethoscope,
  Calculator,
  Scale,
  HeartPulse,
  Beaker,
} from "lucide-react";

interface Subject {
  id: string;
  title: string;
  description: string;
  info: string;
  icon: React.ReactNode;
  colorClass: string;
  textClass: string;
}

const subjects: Subject[] = [
  {
    id: "pharm",
    title: "Pharmacology",
    description: "The art of poisoning people just enough to cure them. Mechanisms, kinetics, and interactions.",
    info: "Deep dive into ADME (Absorption, Distribution, Metabolism, Excretion). We cover everything from Autonomic Nervous System drugs to Antimicrobials. Warning: May cause drowsiness.",
    icon: <FlaskConical />,
    colorClass: "bg-blue-50",
    textClass: "text-medical-600",
  },
  {
    id: "therapeutics",
    title: "Pharmacotherapeutics",
    description: "Guidelines, treatment algorithms, and arguing with doctors about vancomycin dosing.",
    info: "Apply your pharmacology knowledge to disease states. Learn first-line therapies, when to switch agents, and how to manage comorbidities without killing the patient.",
    icon: <Stethoscope />,
    colorClass: "bg-purple-50",
    textClass: "text-purple-600",
  },
  {
    id: "calc",
    title: "Calculations",
    description: "If you miss a decimal point, someone dies. No pressure though.",
    info: "Master the math of medicine. TPNs, flow rates, alligation, and creatinine clearance. We promise it's more useful than calculus.",
    icon: <Calculator />,
    colorClass: "bg-orange-50",
    textClass: "text-orange-600",
  },
  {
    id: "law",
    title: "Law & Ethics",
    description: "How to keep your license, avoid the DEA, and navigate the Controlled Substances Act.",
    info: "Federal vs State law, Controlled Substances Act, and HIPAA. Basically, a guide on how not to go to federal prison.",
    icon: <Scale />,
    colorClass: "bg-slate-100",
    textClass: "text-slate-600",
  },
  {
    id: "anatomy",
    title: "Anatomy & Phys",
    description: "Memorizing 206 bones just to tell people Tylenol works on the brain (probably).",
    info: "Understanding the human body systems. From the cellular level to organ systems. Essential context for why drugs actually work.",
    icon: <HeartPulse />,
    colorClass: "bg-red-50",
    textClass: "text-red-600",
  },
  {
    id: "compound",
    title: "Compounding",
    description: "Cooking, but with dangerous chemicals and sterile technique. Don't lick the spoon.",
    info: "Sterile and Non-sterile compounding techniques. Learn about USP <797> and <795>. It is like baking, but you have to wear a hazmat suit.",
    icon: <Beaker />,
    colorClass: "bg-teal-50",
    textClass: "text-teal-600",
  },
];

export default function StudyPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleSubjectClick = (id: string) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      setSelectedSubject(subject);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <StudyHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={subject.id}
              {...subject}
              delay={`${(index + 1) * 0.1}s`}
              onClick={handleSubjectClick}
            />
          ))}
        </div>
      </main>
      <Footer />

      <SubjectModal
        isOpen={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        subject={selectedSubject}
      />
    </>
  );
}
