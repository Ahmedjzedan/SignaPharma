import { createPortal } from "react-dom";
import { X, Check, Stethoscope, Activity, Brain, Zap, Search, Pill, Siren, Calculator, Sparkles, GraduationCap, Award } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";

export type FilterType = "Specialty" | "Difficulty" | "Scenario";

interface CaseFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: FilterType;
  selectedOption: string | null;
  onSelect: (option: string) => void;
}

interface Option {
  id: string;
  label: string;
  icon?: React.ElementType;
  description?: string;
  range?: string;
  quote?: string;
}

export default function CaseFilterModal({
  isOpen,
  onClose,
  type,
  selectedOption,
  onSelect,
}: CaseFilterModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const getOptions = (): Option[] => {
    switch (type) {
      case "Specialty":
        return [
          { id: "Cardio", label: "Cardiology", icon: Activity, description: "Heart & Vascular" },
          { id: "ID", label: "Infectious Disease", icon: Zap, description: "Bugs & Drugs" },
          { id: "Renal", label: "Nephrology", icon: Stethoscope, description: "Kidneys & Fluids" },
          { id: "Psych", label: "Psychiatry", icon: Brain, description: "Mind & Behavior" },
          { id: "Pulm", label: "Pulmonology", icon: Stethoscope, description: "Lungs & Breathing" },
          { id: "Gastro", label: "Gastroenterology", icon: Activity, description: "Digestive System" },
          { id: "Neuro", label: "Neurology", icon: Brain, description: "Nervous System" },
          { id: "Endo", label: "Endocrinology", icon: Zap, description: "Hormones & Metabolism" },
        ];
      case "Difficulty":
        return [
          {
            id: "Auto",
            label: "Auto",
            icon: Sparkles,
            range: "Dynamic",
            quote: '"The system adapts to your performance."',
          },
          {
            id: "Intern",
            label: "Intern",
            icon: GraduationCap,
            range: "800-1200",
            quote: '"Is this patient breathing?"',
          },
          {
            id: "Resident",
            label: "Resident",
            icon: Stethoscope,
            range: "1200-1800",
            quote: '"Adjust the Vanc dose."',
          },
          {
            id: "Attending",
            label: "Attending",
            icon: Award,
            range: "1800+",
            quote: '"Patient has 4 rare diseases and is allergic to water."',
          },
        ];
      case "Scenario":
        return [
          {
            id: "Diagnosis",
            label: "Diagnosis",
            icon: Search,
            description: "Figure out what's wrong based on the symptoms.",
          },
          {
            id: "Management",
            label: "Management",
            icon: Pill,
            description: "Pick the right medicine to treat the patient.",
          },
          {
            id: "Triage",
            label: "Triage",
            icon: Siren,
            description: "Who needs help first? Make quick decisions.",
          },
          {
            id: "Calculations",
            label: "Calculations",
            icon: Calculator,
            description: "Math time. Calculate doses and rates.",
          },
        ];
      default:
        return [];
    }
  };

  const options = getOptions();
  const isGrid = type === "Specialty";

  return createPortal(
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={clsx(
        "bg-popover rounded-2xl w-full overflow-hidden shadow-2xl animate-scale-in border border-border flex flex-col max-h-[85vh]",
        isGrid ? "max-w-2xl" : "max-w-md"
      )}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-popover-foreground">
            Select {type}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className={clsx(
          "p-4 overflow-y-auto",
          isGrid ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-2"
        )}>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                onClose();
              }}
              className={clsx(
                "w-full text-left rounded-xl border transition-all group relative overflow-hidden flex flex-col",
                isGrid ? "p-4 h-full hover:-translate-y-1 hover:shadow-md" : "p-4",
                selectedOption === option.id
                  ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                  : "bg-card border-border hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              <div className={clsx("flex justify-between", isGrid ? "items-start mb-2" : "items-center")}>
                 <div className="flex items-center gap-3">
                  {/* Icon for Specialty, Scenario, etc */}
                  {option.icon && (
                    <div
                      className={clsx(
                        "p-2 rounded-md shrink-0",
                        selectedOption === option.id
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                      )}
                    >
                      <option.icon className="w-4 h-4" />
                    </div>
                  )}
                  
                  {!isGrid && (
                     <div>
                        <div className="flex items-center gap-2">
                          <span className={clsx("font-bold text-base", selectedOption === option.id ? "text-primary" : "text-foreground")}>
                            {option.label}
                          </span>
                           {type === "Difficulty" && option.range && (
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {option.range}
                            </span>
                          )}
                        </div>
                     </div>
                  )}
                 </div>

                {/* Checkmark for selected */}
                {selectedOption === option.id && (
                  <div className="bg-primary/10 p-1 rounded-full text-primary shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              {isGrid && (
                 <div className="mt-auto">
                    <span className={clsx("font-bold text-base block mb-1", selectedOption === option.id ? "text-primary" : "text-foreground")}>
                        {option.label}
                    </span>
                 </div>
              )}

              {/* Description or Quote */}
              {(option.description || option.quote) && (
                <p className={clsx("text-sm text-muted-foreground leading-snug", !isGrid && "ml-[calc(20px+12px)]")}>
                  {option.description || option.quote}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
