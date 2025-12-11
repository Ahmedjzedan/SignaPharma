"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateScientificBackground } from "@/app/actions/onboarding";
import { Sparkles, GraduationCap, Stethoscope, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const options = [
    {
      id: "Layperson",
      title: "General Interest",
      description: "I'm curious about medicine but not a professional.",
      icon: Sparkles,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      id: "Professional",
      title: "Healthcare World",
      description: "I'm a student, pharmacist, nurse, or doctor.",
      icon: Stethoscope,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
  ];

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await updateScientificBackground(selected);
      onComplete();
    } catch (error) {
      console.error("Failed to update background", error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-100000 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-border">
        {/* Header with gradient */}
        <div className="relative h-32 bg-linear-to-b from-medical-600 to-medical-800 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
          <div className="relative z-10 text-center">
            <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-2 backdrop-blur-md border border-white/30">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to SignaPharma</h2>
          </div>
        </div>
        
        <div className="p-8 relative z-10">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg mb-2">
              To give you the best experience, tell us a bit about your background.
            </p>
            <p className="text-sm text-muted-foreground/80">
              (You can always change this later in your profile settings)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={clsx(
                  "flex items-center text-left p-4 rounded-xl border-2 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden gap-4",
                  selected === option.id
                    ? `border-primary bg-primary/5 ring-2 ring-primary/10`
                    : "border-border bg-card hover:border-primary/30 hover:bg-accent/30"
                )}
              >
                <div className={clsx("shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", option.bg, option.color)}>
                  <option.icon className="w-5 h-5" />
                </div>
                <div className="grow">
                  <h3 className="font-bold text-base text-foreground">{option.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </div>
                {selected === option.id && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!selected || loading}
              className={clsx(
                "px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg",
                selected && !loading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {loading ? "Saving..." : "Start My Journey"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
