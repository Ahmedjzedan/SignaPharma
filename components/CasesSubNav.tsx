"use client";

import { useState } from "react";
import { Stethoscope, Trophy, Layers, ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import CaseFilterModal, { FilterType } from "./CaseFilterModal";

export default function CasesSubNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeModal, setActiveModal] = useState<FilterType | null>(null);
  
  // Get initial state from URL
  const specialty = searchParams.get("specialty");
  const difficulty = searchParams.get("difficulty");
  const scenario = searchParams.get("scenario");

  const updateFilter = (type: FilterType, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const key = type.toLowerCase();
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`/cases?${params.toString()}`);
  };

  const getActiveLabel = (type: FilterType) => {
    switch (type) {
      case "Specialty":
        return specialty || "Specialty";
      case "Difficulty":
        return difficulty || "Difficulty";
      case "Scenario":
        return scenario || "Scenario";
      default:
        return "";
    }
  };

  const clearFilter = (e: React.MouseEvent, type: FilterType) => {
    e.stopPropagation();
    updateFilter(type, null);
  };

  return (
    <>
      <nav className="fixed top-16 w-full z-30 glass transition-all bg-background/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 h-12 overflow-x-auto no-scrollbar">
            
            {/* Specialty Filter */}
            <button
              onClick={() => setActiveModal("Specialty")}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 border",
                specialty
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-accent hover:text-foreground"
              )}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              {getActiveLabel("Specialty")}
              {specialty ? (
                <div
                  role="button"
                  onClick={(e) => clearFilter(e, "Specialty")}
                  className="hover:bg-primary/20 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </div>
              ) : (
                <ChevronDown className="w-3 h-3 opacity-50" />
              )}
            </button>

            {/* Difficulty Filter */}
            <button
              onClick={() => setActiveModal("Difficulty")}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 border",
                difficulty
                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-accent hover:text-foreground"
              )}
            >
              <Trophy className="w-3.5 h-3.5" />
              {getActiveLabel("Difficulty")}
              {difficulty ? (
                <div
                  role="button"
                  onClick={(e) => clearFilter(e, "Difficulty")}
                  className="hover:bg-yellow-500/20 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </div>
              ) : (
                <ChevronDown className="w-3 h-3 opacity-50" />
              )}
            </button>

            {/* Scenario Filter */}
            <button
              onClick={() => setActiveModal("Scenario")}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 border",
                scenario
                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-accent hover:text-foreground"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              {getActiveLabel("Scenario")}
              {scenario ? (
                <div
                  role="button"
                  onClick={(e) => clearFilter(e, "Scenario")}
                  className="hover:bg-blue-500/20 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </div>
              ) : (
                <ChevronDown className="w-3 h-3 opacity-50" />
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* Modals */}
      <CaseFilterModal
        isOpen={activeModal === "Specialty"}
        onClose={() => setActiveModal(null)}
        type="Specialty"
        selectedOption={specialty}
        onSelect={(val) => {
          updateFilter("Specialty", val);
          setActiveModal(null);
        }}
      />
      <CaseFilterModal
        isOpen={activeModal === "Difficulty"}
        onClose={() => setActiveModal(null)}
        type="Difficulty"
        selectedOption={difficulty}
        onSelect={(val) => {
          updateFilter("Difficulty", val);
          setActiveModal(null);
        }}
      />
      <CaseFilterModal
        isOpen={activeModal === "Scenario"}
        onClose={() => setActiveModal(null)}
        type="Scenario"
        selectedOption={scenario}
        onSelect={(val) => {
          updateFilter("Scenario", val);
          setActiveModal(null);
        }}
      />
    </>
  );
}
