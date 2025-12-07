"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import StudyHeader from "../../components/StudyHeader";
import SubjectCard from "../../components/SubjectCard";
import SubjectModal from "../../components/SubjectModal";

export interface Subject {
  id: string;
  title: string;
  description: string;
  info: string;
  icon: React.ReactNode;
  colorClass: string;
  textClass: string;
}

interface StudyContentProps {
  subjects: Subject[];
}

export default function StudyContent({ subjects }: StudyContentProps) {
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
