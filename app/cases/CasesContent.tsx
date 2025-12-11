"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CaseHeader from "../../components/CaseHeader";
import PatientChart from "../../components/PatientChart";
import CaseInteraction from "../../components/CaseInteraction";

// Define types for the parsed JSON data
interface PatientData {
  name: string;
  dob: string;
  age: number;
  allergy: string;
  vitals: {
    hr: number;
    bp: string;
    temp: number;
  };
  history: {
    hpi: string;
    pmh: string[];
    meds: string[];
  };
  progress: {
    current: number;
    total: number;
  };
}

interface ScenarioData {
  doctorImage: string;
  doctorName: string;
  prompt: string;
}

interface QuizOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

interface QuizData {
  options: QuizOption[];
  feedback: {
    success: { title: string; message: string };
    fail: { title: string; message: string };
  };
}

export interface Case {
  id: string;
  title: string;
  isUrgent: boolean; // Derived or stored
  patient: PatientData;
  scenario: ScenarioData;
  quiz: QuizData;
  authorName?: string;
}

interface CasesContentProps {
  initialCase: Case;
}

import { updateUserStats } from "@/app/actions/profile";

import OnboardingModal from "@/components/OnboardingModal";
import CaseCreationModal from "@/components/CaseCreationModal";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function CasesContent({ 
  initialCase, 
  showOnboarding, 
  initialElo = 1500,
  isLayperson = false,
  initialCasesSolved = 0
}: CasesContentProps & { 
  showOnboarding?: boolean; 
  initialElo?: number;
  isLayperson?: boolean;
  initialCasesSolved?: number;
}) {
  const router = useRouter();
  const [elo, setElo] = useState(initialElo);
  const [casesSolved, setCasesSolved] = useState(initialCasesSolved);
  const [eloChange, setEloChange] = useState<number | null>(null);
  const [caseAttempted, setCaseAttempted] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!!showOnboarding);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  // In a real app with multiple cases, we'd have state to switch cases.
  // For now, we just display the one passed in.
  const [currentCase, setCurrentCase] = useState<Case>(initialCase);

  // Removed localStorage effect for ELO initialization as it's now passed from server

  const handleComplete = async (isCorrect: boolean) => {
    if (caseAttempted) return;

    let change = 0;
    let newElo = elo;

    if (!isLayperson) {
      change = isCorrect ? 12 : -12;
      newElo = elo + change;
      setElo(newElo);
      setEloChange(change);
      localStorage.setItem("signapharma_elo", newElo.toString());
    }
    
    setCaseAttempted(true);
    
    if (isCorrect && isLayperson) {
      setCasesSolved(prev => prev + 1);
    }

    try {
      await updateUserStats({ 
        eloChange: isLayperson ? undefined : change, 
        incrementStreak: isCorrect,
        caseId: isCorrect ? currentCase.id : undefined
      });
    } catch (error) {
      console.error("Failed to update stats", error);
    }
  };

  const handleReset = () => {
    setEloChange(null);
    // We don't reset caseAttempted here to prevent ELO farming on the same case instance
  };

  const handleNext = () => {
    // In a full implementation, this would trigger a server action or router refresh to get a new case.
    // For this demo, we'll just reload the page to fetch a random case again (if logic supports it)
    // or just reset the UI state if we had a list of cases.
    window.location.reload();
  };

  return (
    <>
      <CaseCreationModal 
        isOpen={isCreationModalOpen} 
        onClose={() => setIsCreationModalOpen(false)} 
      />
      <OnboardingModal 
        isOpen={isOnboardingOpen} 
        onComplete={() => {
          setIsOnboardingOpen(false);
          router.refresh(); // Refresh to get new cases based on background
        }} 
      />
      <Navbar />
      <main className="grow pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <CaseHeader
            caseId={currentCase.id}
            isUrgent={currentCase.isUrgent}
            title={currentCase.title}
            elo={elo}
            eloChange={eloChange}
            isLayperson={isLayperson}
            casesSolved={casesSolved}
            authorName={currentCase.authorName}
          />

          <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
            <PatientChart
              caseId={currentCase.id}
              patient={currentCase.patient}
              vitals={currentCase.patient.vitals}
              history={currentCase.patient.history}
              progress={currentCase.patient.progress}
            />

            <CaseInteraction
              doctorImage={currentCase.scenario.doctorImage}
              doctorName={currentCase.scenario.doctorName}
              prompt={currentCase.scenario.prompt}
              options={currentCase.quiz.options}
              feedback={currentCase.quiz.feedback}
              onComplete={handleComplete}
              onReset={handleReset}
              onNext={handleNext}
              isLayperson={isLayperson}
            />
          </div>

          {!isLayperson && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setIsCreationModalOpen(true)}
                className="px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your Own Case
              </button>
            </div>
          )}
      </main>
      <Footer />
    </>
  );
}
