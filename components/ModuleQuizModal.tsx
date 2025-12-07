"use client";

import { useState } from "react";
import { X, Award } from "lucide-react";
import clsx from "clsx";

interface ModuleQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
}

export default function ModuleQuizModal({
  isOpen,
  onClose,
  onFinish,
}: ModuleQuizModalProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<{ [key: number]: boolean | null }>({
    1: null,
    2: null,
  });

  if (!isOpen) return null;

  const handleAnswer = (questionNum: number, isCorrect: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionNum]: isCorrect }));

    setTimeout(() => {
      if (questionNum === 1) {
        setStep(2);
      } else if (questionNum === 2) {
        setStep(3);
      }
    }, 1000);
  };

  const getButtonClass = (questionNum: number, isCorrectOption: boolean) => {
    const answer = answers[questionNum];
    if (answer === null)
      return "border-slate-100 hover:border-slate-300 hover:bg-slate-50";

    if (isCorrectOption) {
      // If this option is correct, and the user selected it (or we just want to show the correct answer)
      return answer === true
        ? "bg-green-50 border-green-500 text-green-700"
        : "border-slate-100 opacity-50";
    } else {
      // If this option is incorrect
      return answer === false
        ? "bg-red-50 border-red-500 text-red-700"
        : "border-slate-100 opacity-50";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-sm transition-opacity flex min-h-full items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Quiz Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              GFR Mastery Check
            </h3>
            <div className="flex gap-1 mt-1">
              <div className="w-8 h-1.5 rounded-full bg-medical-600 transition-all"></div>
              <div
                className={clsx(
                  "w-8 h-1.5 rounded-full transition-all",
                  step >= 2 ? "bg-medical-600" : "bg-slate-200"
                )}
              ></div>
              <div
                className={clsx(
                  "w-8 h-1.5 rounded-full transition-all",
                  step >= 3 ? "bg-medical-600" : "bg-slate-200"
                )}
              ></div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Container */}
        <div className="p-8 overflow-y-auto">
          {/* Question 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h4 className="text-xl font-bold text-slate-900 leading-snug">
                If you constrict the{" "}
                <span className="text-medical-600">Efferent Arteriole</span>{" "}
                (the exit), what initially happens to GFR?
              </h4>
              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer(1, false)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-600 ${
                    answers[1] === false
                      ? "bg-red-50 border-red-500 text-red-700"
                      : answers[1] === true
                      ? "opacity-50 border-slate-100"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  disabled={answers[1] !== null}
                >
                  Decreases (Less blood flow)
                </button>
                <button
                  onClick={() => handleAnswer(1, true)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-600 ${
                    answers[1] === true
                      ? "bg-green-50 border-green-500 text-green-700"
                      : answers[1] === false
                      ? "opacity-50 border-slate-100"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  disabled={answers[1] !== null}
                >
                  Increases (Higher pressure in glomerulus)
                </button>
                <button
                  onClick={() => handleAnswer(1, false)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-600 ${
                    answers[1] === false
                      ? "bg-red-50 border-red-500 text-red-700"
                      : answers[1] === true
                      ? "opacity-50 border-slate-100"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  disabled={answers[1] !== null}
                >
                  Stays the same (Autoregulation cancels it)
                </button>
              </div>
            </div>
          )}

          {/* Question 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <h4 className="text-xl font-bold text-slate-900 leading-snug">
                Which force primarily opposes filtration (pulls fluid back in)?
              </h4>
              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer(2, false)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-600 ${
                    answers[2] === false
                      ? "bg-red-50 border-red-500 text-red-700"
                      : answers[2] === true
                      ? "opacity-50 border-slate-100"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  disabled={answers[2] !== null}
                >
                  Hydrostatic Pressure
                </button>
                <button
                  onClick={() => handleAnswer(2, false)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-600 ${
                    answers[2] === false
                      ? "bg-red-50 border-red-500 text-red-700"
                      : answers[2] === true
                      ? "opacity-50 border-slate-100"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  disabled={answers[2] !== null}
                >
                  Bowman's Space Pressure
                </button>
                <button
                  onClick={() => handleAnswer(2, true)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-600 ${
                    answers[2] === true
                      ? "bg-green-50 border-green-500 text-green-700"
                      : answers[2] === false
                      ? "opacity-50 border-slate-100"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  disabled={answers[2] !== null}
                >
                  Plasma Oncotic Pressure
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {step === 3 && (
            <div className="text-center py-8 animate-slide-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Quiz Complete!
              </h3>
              <p className="text-slate-500 mb-8">
                You clearly paid attention. The kidney approves.
              </p>
              <button
                onClick={onFinish}
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg"
              >
                Finish & Flag Module
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
