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
import { saveDrugToLibrary } from "@/app/actions/drugs";
import { deleteDrugFromLibrary } from "@/app/actions/deleteDrug";
import { FDADrugResult } from "@/app/actions/fda";

// Types matching the DB/UI needs
export interface Drug {
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

interface LibraryContentProps {
  initialDrugs: Drug[];
  topDoctors: any[]; // Using any for simplicity here, or define a proper type
}

export default function LibraryContent({ initialDrugs, topDoctors }: LibraryContentProps) {
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



// ... imports

  const handleAddDrug = async (fdaDrug: FDADrugResult) => {
    // Optimistic update
    const newDrug: Drug = {
      id: fdaDrug.id,
      name: fdaDrug.brand_name,
      class: fdaDrug.pharm_class[0] || "Unknown Class",
      mastery: 0,
      color: "blue", // Default
      formula: fdaDrug.active_ingredient || "N/A",
      brands: fdaDrug.brand_name,
      manufacturer: fdaDrug.manufacturer_name,
      warnings: fdaDrug.warnings,
      indications: fdaDrug.indications_and_usage,
      moa: fdaDrug.mechanism_of_action,
      dosage: fdaDrug.dosage_and_administration || "N/A",
    };
    
    setDrugs([...drugs, newDrug]);
    setIsAddModalOpen(false);

    try {
      await saveDrugToLibrary(fdaDrug);
    } catch (error) {
      console.error("Failed to save drug", error);
      // Revert if failed (optional, for now just log)
    }
  };



  const handleDeleteDrug = async (id: string) => {
    // Optimistic update
    setDrugs(drugs.filter((d) => d.id !== id));
    
    try {
      await deleteDrugFromLibrary(id);
    } catch (error) {
      console.error("Failed to delete drug", error);
      // Revert if failed (optional)
    }
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
      <main className="grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
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
              It&apos;s a little dusty in here. Search for drugs you encounter in
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
        existingDrugIds={drugs.map((d) => d.id)}
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
