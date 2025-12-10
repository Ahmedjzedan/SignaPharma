"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle, Skull, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface Option {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

interface CaseInteractionProps {
  doctorImage: string;
  doctorName: string;
  prompt: string;
  options: Option[];
  feedback: {
    success: { title: string; message: string };
    fail: { title: string; message: string };
  };
  onComplete: (isCorrect: boolean) => void;
  onReset: () => void;
  onNext: () => void;
}

export default function CaseInteraction({
  doctorImage,
  doctorName,
  prompt,
  options,
  feedback,
  onComplete,
  onReset,
  onNext,
}: CaseInteractionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleChoice = (option: Option) => {
    if (selectedOption) return; // Prevent double guessing

    setSelectedOption(option.id);
    setIsCorrect(option.isCorrect);
    onComplete(option.isCorrect);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    onReset();
  };

  return (
    <section className="lg:w-2/3 flex flex-col">
      {/* The "Sarcastic Doctor" Prompt */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-8 relative">
        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-3 left-8 w-6 h-6 bg-card border-b border-r border-border transform rotate-45 md:hidden"></div>
        <div className="absolute top-8 -left-3 w-6 h-6 bg-card border-b border-l border-border transform rotate-45 hidden md:block"></div>

        <div className="flex items-start gap-4">
          <div className="hidden md:block w-14 h-14 rounded-full bg-muted shrink-0 border-4 border-background shadow-lg overflow-hidden">
            <img
              src={doctorImage}
              alt="Attending"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-medical-600 uppercase mb-1">
              {doctorName}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-card-foreground leading-tight">
              &quot;{prompt}&quot;
            </h2>
          </div>
        </div>
      </div>

      {/* MCQ Interface */}
      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleChoice(option)}
            disabled={!!selectedOption}
            className={clsx(
              "w-full text-left p-5 rounded-xl border-2 transition-all group flex items-center justify-between",
              selectedOption === null
                ? "border-border bg-card hover:border-medical-500 hover:bg-medical-50 dark:hover:bg-medical-900/20"
                : selectedOption === option.id
                ? option.isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200"
                  : "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200"
                : "opacity-50 cursor-not-allowed border-border bg-card"
            )}
          >
            <div>
              <span
                className={clsx(
                  "block text-xs font-bold mb-1",
                  selectedOption === null
                    ? "text-muted-foreground group-hover:text-medical-500"
                    : selectedOption === option.id
                    ? option.isCorrect
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
                )}
              >
                {option.label}
              </span>
              <span className="text-lg font-medium text-foreground">
                {option.text}
              </span>
            </div>
            <ChevronRight
              className={clsx(
                "w-5 h-5",
                selectedOption === null
                  ? "text-muted-foreground/30 group-hover:text-medical-500"
                  : selectedOption === option.id
                  ? option.isCorrect
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>

      {/* FEEDBACK STATES */}
      {isCorrect === true && (
        <div className="mt-8 animate-pop-in">
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-success-text mb-2">
                  {feedback.success.title}
                </h3>
                <p className="text-success-text text-lg mb-4">
                  &quot;{feedback.success.message}&quot;
                </p>
                <button
                  onClick={onNext}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-md flex items-center"
                >
                  Next Case <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCorrect === false && (
        <div className="mt-8 animate-shake">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                <Skull className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-failure-text mb-2">
                  {feedback.fail.title}
                </h3>
                <p className="text-failure-text text-lg mb-4">
                  &quot;{feedback.fail.message}&quot;
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-card border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Try Again (Don&apos;t kill her this time)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
