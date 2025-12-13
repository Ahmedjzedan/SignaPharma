"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LibraryHeader from "../../components/LibraryHeader";
import DrugCard from "../../components/DrugCard";
import AddDrugModal from "../../components/AddDrugModal";
import ViewDrugModal from "../../components/ViewDrugModal";
import ExamModal from "../../components/ExamModal";
import RequestDrugModal from "../../components/RequestDrugModal";
import { PackageOpen, ArchiveRestore } from "lucide-react";
import { saveDrugToLibrary } from "@/app/actions/drugs";
import { deleteDrugFromLibrary } from "@/app/actions/deleteDrug";
import { FDADrugResult } from "@/app/actions/fda";
import { getDrugColor } from "@/lib/utils";
import { toast } from "sonner";
import { getLibraryStats } from "@/app/actions/drugs";
import { useEffect } from "react";

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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestQuery, setRequestQuery] = useState("");

  const [stats, setStats] = useState({
    collected: initialDrugs.length,
    total: 0, // Will fetch
    mastered: initialDrugs.filter((d) => d.mastery === 100).length,
    streak: 5,
  });

  useEffect(() => {
    async function fetchStats() {
      const dynamicStats = await getLibraryStats();
      if (dynamicStats) {
        setStats(prev => ({
          ...prev,
          collected: dynamicStats.collected,
          total: dynamicStats.total,
        }));
      }
    }
    fetchStats();
  }, [drugs.length]); // Refetch when drugs change

  const handleAddDrug = async (fdaDrug: FDADrugResult) => {
    // Optimistic update
    const newDrug: Drug = {
      id: fdaDrug.id,
      name: fdaDrug.brand_name,
      class: fdaDrug.pharm_class[0] || "Unknown Class",
      mastery: 0,
      color: getDrugColor(fdaDrug.brand_name), // Default
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
    toast.success(`Added ${newDrug.name} to library`);

    try {
      await saveDrugToLibrary(fdaDrug);
    } catch (error) {
      console.error("Failed to save drug", error);
      toast.error("Failed to save drug");
      // Revert if failed (optional, for now just log)
    }
  };

  const handleDeleteDrug = async (id: string) => {
    // Optimistic update
    const drugToDelete = drugs.find(d => d.id === id);
    setDrugs(drugs.filter((d) => d.id !== id));
    toast.success(`Removed ${drugToDelete?.name || "drug"} from library`);
    
    try {
      await deleteDrugFromLibrary(id);
    } catch (error) {
      console.error("Failed to delete drug", error);
      toast.error("Failed to delete drug");
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

  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrugs = drugs.filter(drug => 
    drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drug.brands.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drug.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <LibraryHeader 
          stats={stats} 
          onAddDrug={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
        
        {filteredDrugs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDrugs.map((drug, index) => (
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
            {searchQuery ? (
               <div className="text-center">
                 <p className="text-muted-foreground text-lg mb-2">No drugs found matching &quot;{searchQuery}&quot;</p>
                 <button 
                   onClick={() => setSearchQuery("")}
                   className="text-primary hover:underline font-medium"
                 >
                   Clear search
                 </button>
               </div>
            ) : (
              <>
                <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative">
                  <PackageOpen className="w-24 h-24 text-slate-300" />
                  <ArchiveRestore className="w-8 h-8 text-slate-400 absolute top-10 right-10 opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Your cabinet is empty</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
                  Start building your digital pharmacy by adding drugs you want to master.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-medical-500 text-slate-700 hover:text-medical-600 font-bold rounded-xl transition-all"
                >
                  Search Database
                </button>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />

      <AddDrugModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDrug}
        onRequest={(query) => {
          setIsAddModalOpen(false);
          setRequestQuery(query);
          setIsRequestModalOpen(true);
        }}
        existingDrugIds={drugs.map((d) => d.id)}
        existingDrugNames={drugs.map((d) => d.name)}
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

      <RequestDrugModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        initialQuery={requestQuery}
      />
    </>
  );
}
