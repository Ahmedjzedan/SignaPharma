"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CaseHeader from "../../components/CaseHeader";
import PatientChart from "../../components/PatientChart";
import CaseInteraction from "../../components/CaseInteraction";

export default function CasesPage() {
  const [elo, setElo] = useState(1500);
  const [eloChange, setEloChange] = useState<number | null>(null);
  const [caseAttempted, setCaseAttempted] = useState(false);

  useEffect(() => {
    const storedElo = localStorage.getItem("signapharma_elo");
    if (storedElo) {
      setElo(parseInt(storedElo, 10));
    }
  }, []);

  const handleComplete = (isCorrect: boolean) => {
    if (caseAttempted) return;

    const change = isCorrect ? 12 : -12;
    const newElo = elo + change;

    setElo(newElo);
    setEloChange(change);
    setCaseAttempted(true);
    localStorage.setItem("signapharma_elo", newElo.toString());
  };

  const handleReset = () => {
    // Resetting doesn't allow farming ELO, so caseAttempted remains true
    setEloChange(null);
  };

  const handleNext = () => {
    // For now, just reset the state to simulate a new case
    // In a real app, this would fetch the next case
    setEloChange(null);
    setCaseAttempted(false); // Allow ELO change for the "new" case
    // You might want to rotate case data here in the future
  };

  const caseData = {
    caseId: "1402",
    isUrgent: true,
    title: "The Dizzy Grandma",
    patient: {
      name: "Mrs. Edith Miller",
      dob: "12/04/1951",
      age: 73,
      allergy: "PCN",
    },
    vitals: {
      hr: 112,
      bp: "88/52",
      temp: 37.2,
    },
    history: {
      hpi: "Patient presents to ED via ambulance c/o extreme dizziness and generalized weakness starting 2 hours ago. Found by daughter on bathroom floor.",
      pmh: [
        "Hypertension (HTN)",
        "Type 2 Diabetes (T2DM)",
        "Chronic Kidney Disease (Stage 3)",
      ],
      meds: [
        "Lisinopril 40mg daily",
        "Metformin 1000mg BID",
        "Amlodipine 10mg daily",
        "HCTZ 25mg daily (Refill picked up yesterday)",
      ],
    },
    progress: {
      current: 1,
      total: 3,
    },
  };

  const doctorData = {
    doctorImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=House&eyebrows=angry&mouth=serious",
    doctorName: "Attending Physician (Dr. Grumpy)",
    prompt:
      "Look at those vitals. She's hypotensive, tachycardia, and dry as a bone. How would you treat her, or are you trying to lower the population today?",
  };

  const quizOptions = [
    {
      id: "option1",
      label: "Option A",
      text: "Administer Lisinopril 40mg PO to control rate.",
      isCorrect: false,
    },
    {
      id: "option2",
      label: "Option B",
      text: "Hold antihypertensives, start IV fluids (Normal Saline).",
      isCorrect: true,
    },
    {
      id: "option3",
      label: "Option C",
      text: "Start Metoprolol 5mg IV push.",
      isCorrect: false,
    },
    {
      id: "option4",
      label: "Option D",
      text: "Discharge home with instructions to drink water.",
      isCorrect: false,
    },
  ];

  const feedback = {
    success: {
      title: "Saved her.",
      message:
        "Insurance hates you because staying in the hospital is expensive, but good job. She was dehydrated and over-medicated. Holding the ACE/Diuretic and giving fluids fixed the perfusion.",
    },
    fail: {
      title: "Congrats, she's dead.",
      message:
        "Stick to retail? You just gave a hypotensive patient (BP 88/52) more antihypertensives. You bottomed out her pressure and caused organ failure. Great work.",
    },
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CaseHeader
          caseId={caseData.caseId}
          isUrgent={caseData.isUrgent}
          title={caseData.title}
          elo={elo}
          eloChange={eloChange}
        />

        <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
          <PatientChart
            patient={caseData.patient}
            vitals={caseData.vitals}
            history={caseData.history}
            progress={caseData.progress}
          />

          <CaseInteraction
            doctorImage={doctorData.doctorImage}
            doctorName={doctorData.doctorName}
            prompt={doctorData.prompt}
            options={quizOptions}
            feedback={feedback}
            onComplete={handleComplete}
            onReset={handleReset}
            onNext={handleNext}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
