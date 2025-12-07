"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LibraryHeader from "../../components/LibraryHeader";
import DrugCard from "../../components/DrugCard";
import AddDrugModal from "../../components/AddDrugModal";
import ViewDrugModal from "../../components/ViewDrugModal";
import ExamModal from "../../components/ExamModal";
import { PackageOpen, ArchiveRestore } from "lucide-react";

// Mock Data Types
interface Drug {
  id: string;
  name: string;
  class: string;
  mastery: number;
  color: "blue" | "purple" | "green" | "orange";
  formula: string;
  brands: string;
  manufacturer: string;
  warnings: string;
  indications: string;
  moa: string;
  dosage: string;
}

const initialDrugs: Drug[] = [
  {
    id: "1",
    name: "Lisinopril",
    class: "ACE Inhibitor",
    mastery: 80,
    color: "blue",
    formula: "C21H31N3O5",
    brands: "Zestril, Prinivil, Qbrelis",
    manufacturer: "Various (Generic Available)",
    warnings:
      "Fetal Toxicity: Discontinue as soon as pregnancy is detected. Can cause injury/death to developing fetus.",
    indications:
      "Hypertension (HTN), Heart Failure (CHF), Acute Myocardial Infarction (AMI).",
    moa: "Competitive inhibitor of angiotensin-converting enzyme (ACE); prevents conversion of angiotensin I to angiotensin II, a potent vasoconstrictor.",
    dosage:
      "HTN: 10mg daily initial, 20-40mg maintenance.\nCHF: 5mg daily initial, max 40mg daily.",
  },
  {
    id: "2",
    name: "Atorvastatin",
    class: "HMG-CoA Reductase Inhibitor",
    mastery: 45,
    color: "purple",
    formula: "C33H35FN2O5",
    brands: "Lipitor",
    manufacturer: "Pfizer (and Generics)",
    warnings:
      "Contraindicated in active liver disease. Skeletal muscle effects (myopathy, rhabdomyolysis) risk increases with certain interactions.",
    indications:
      "Hyperlipidemia, prevention of cardiovascular disease, homozygous familial hypercholesterolemia.",
    moa: "Selective, competitive inhibitor of HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis.",
    dosage: "10-80mg PO daily. Assess lipid levels 2-4 weeks after initiation.",
  },
  {
    id: "3",
    name: "Metformin",
    class: "Biguanide",
    mastery: 100,
    color: "green",
    formula: "C4H11N5",
    brands: "Glucophage, Fortamet, Glumetza",
    manufacturer: "Bristol-Myers Squibb (and Generics)",
    warnings:
      "Lactic Acidosis: Rare but serious metabolic complication. Risk increases with renal impairment, age >65, and hypoxic states.",
    indications: "Type 2 Diabetes Mellitus, Polycystic Ovary Syndrome (Off-label).",
    moa: "Decreases hepatic glucose production, decreases intestinal absorption of glucose, and improves insulin sensitivity.",
    dosage:
      "Initial: 500mg BID or 850mg daily. Max: 2550mg daily (IR) or 2000mg daily (ER).",
  },
];

export default function LibraryPage() {
  const [drugs, setDrugs] = useState<Drug[]>(initialDrugs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewDrug, setViewDrug] = useState<Drug | null>(null);
  const [examDrug, setExamDrug] = useState<string | null>(null);

  const stats = {
    collected: drugs.length,
    total: 50,
    mastered: drugs.filter((d) => d.mastery === 100).length,
    streak: 5,
  };

  const handleAddDrug = (name: string) => {
    // Mock adding a drug
    const newDrug: Drug = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      class: "Unknown Class",
      mastery: 0,
      color: "orange", // Default color for new drugs
      formula: "N/A",
      brands: "N/A",
      manufacturer: "N/A",
      warnings: "N/A",
      indications: "N/A",
      moa: "N/A",
      dosage: "N/A",
    };
    setDrugs([...drugs, newDrug]);
    setIsAddModalOpen(false);
  };

  const handleDeleteDrug = (id: string) => {
    setDrugs(drugs.filter((d) => d.id !== id));
  };

  const handleViewDrug = (name: string) => {
    const drug = drugs.find((d) => d.name === name);
    if (drug) setViewDrug(drug);
  };

  const handleExamDrug = (name: string) => {
    setExamDrug(name);
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <LibraryHeader stats={stats} onAddDrug={() => setIsAddModalOpen(true)} />

        {drugs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {drugs.map((drug, index) => (
              <DrugCard
                key={drug.id}
                {...drug}
                delay={`${(index + 1) * 0.1}s`}
                onExam={handleExamDrug}
                onView={handleViewDrug}
                onDelete={handleDeleteDrug}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative">
              <PackageOpen className="w-24 h-24 text-slate-300" />
              <ArchiveRestore className="w-8 h-8 text-slate-400 absolute top-10 right-10 opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your cabinet is empty
            </h2>
            <p className="text-slate-500 max-w-md text-center mb-8">
              It's a little dusty in here. Search for drugs you encounter in
              practice to start building your arsenal.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-medical-500 text-slate-700 hover:text-medical-600 font-bold rounded-xl transition-all"
            >
              Search Database
            </button>
          </div>
        )}
      </main>
      <Footer />

      <AddDrugModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDrug}
      />

      <ViewDrugModal
        isOpen={!!viewDrug}
        onClose={() => setViewDrug(null)}
        drug={viewDrug}
      />

      <ExamModal
        isOpen={!!examDrug}
        onClose={() => setExamDrug(null)}
        drugName={examDrug || ""}
      />
    </>
  );
}
