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
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 relative">
        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-3 left-8 w-6 h-6 bg-white border-b border-r border-slate-200 transform rotate-45 md:hidden"></div>
        <div className="absolute top-8 -left-3 w-6 h-6 bg-white border-b border-l border-slate-200 transform rotate-45 hidden md:block"></div>

        <div className="flex items-start gap-4">
          <div className="hidden md:block w-14 h-14 rounded-full bg-slate-800 flex-shrink-0 border-4 border-white shadow-lg overflow-hidden">
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
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
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
                ? "border-slate-200 bg-white hover:border-medical-500 hover:bg-medical-50"
                : selectedOption === option.id
                ? option.isCorrect
                  ? "bg-green-50 border-green-500 text-green-800"
                  : "bg-red-50 border-red-500 text-red-800"
                : "opacity-50 cursor-not-allowed border-slate-200 bg-white"
            )}
          >
            <div>
              <span
                className={clsx(
                  "block text-xs font-bold mb-1",
                  selectedOption === null
                    ? "text-slate-400 group-hover:text-medical-500"
                    : selectedOption === option.id
                    ? option.isCorrect
                      ? "text-green-600"
                      : "text-red-600"
                    : "text-slate-400"
                )}
              >
                {option.label}
              </span>
              <span className="text-lg font-medium text-slate-800">
                {option.text}
              </span>
            </div>
            <ChevronRight
              className={clsx(
                "w-5 h-5",
                selectedOption === null
                  ? "text-slate-300 group-hover:text-medical-500"
                  : selectedOption === option.id
                  ? option.isCorrect
                    ? "text-green-600"
                    : "text-red-600"
                  : "text-slate-300"
              )}
            />
          </button>
        ))}
      </div>

      {/* FEEDBACK STATES */}
      {isCorrect === true && (
        <div className="mt-8 animate-pop-in">
          <div className="bg-success-50 border-l-4 border-success-500 p-6 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-success-100 rounded-full text-success-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-success-800 mb-2">
                  {feedback.success.title}
                </h3>
                <p className="text-success-800 text-lg mb-4">
                  &quot;{feedback.success.message}&quot;
                </p>
                <button
                  onClick={onNext}
                  className="px-6 py-3 bg-success-600 hover:bg-success-700 text-white font-bold rounded-lg transition-colors shadow-md flex items-center"
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
          <div className="bg-danger-50 border-l-4 border-danger-500 p-6 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-danger-100 rounded-full text-danger-600">
                <Skull className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-danger-800 mb-2">
                  {feedback.fail.title}
                </h3>
                <p className="text-danger-800 text-lg mb-4">
                  &quot;{feedback.fail.message}&quot;
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white border border-danger-200 text-danger-600 font-bold rounded-lg hover:bg-danger-50 transition-colors"
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
