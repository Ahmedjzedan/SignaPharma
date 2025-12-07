import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  drugName: string;
}

export default function ExamModal({
  isOpen,
  onClose,
  drugName,
}: ExamModalProps) {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeft(10);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-900"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Bar */}
      <div className="w-full bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <X className="w-4 h-4" /> Quit Exam
          </button>
          <div className="h-6 w-px bg-slate-700"></div>
          <span className="text-slate-200 font-bold">
            {drugName} Mastery
          </span>
        </div>

        {/* Timer & Progress */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Time Left
            </span>
            <span className="text-red-500 font-mono text-xl font-bold animate-pulse-fast">
              00:{timeLeft.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="bg-medical-500 h-full rounded-full"
              style={{ width: "2%" }}
            ></div>
          </div>
          <span className="text-xs text-slate-400 font-mono">1/50</span>
        </div>
      </div>

      {/* Exam Content */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-4 max-w-3xl mx-auto">
        {/* Question Card */}
        <div className="w-full space-y-8 animate-slide-up">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 mb-6">
              Question 1
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
              Which of the following is a major adverse effect associated with{" "}
              {drugName} that often leads to discontinuation?
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <button className="p-6 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-medical-500 hover:bg-slate-750 text-left transition-all group">
              <span className="block text-xs font-bold text-slate-500 mb-1 group-hover:text-medical-400">
                Option A
              </span>
              <span className="text-lg text-slate-200 font-medium">
                Hypokalemia
              </span>
            </button>

            <button className="p-6 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-medical-500 hover:bg-slate-750 text-left transition-all group">
              <span className="block text-xs font-bold text-slate-500 mb-1 group-hover:text-medical-400">
                Option B
              </span>
              <span className="text-lg text-slate-200 font-medium">
                Dry, non-productive cough
              </span>
            </button>

            <button className="p-6 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-medical-500 hover:bg-slate-750 text-left transition-all group">
              <span className="block text-xs font-bold text-slate-500 mb-1 group-hover:text-medical-400">
                Option C
              </span>
              <span className="text-lg text-slate-200 font-medium">
                Reflex Tachycardia
              </span>
            </button>

            <button className="p-6 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-medical-500 hover:bg-slate-750 text-left transition-all group">
              <span className="block text-xs font-bold text-slate-500 mb-1 group-hover:text-medical-400">
                Option D
              </span>
              <span className="text-lg text-slate-200 font-medium">
                Peripheral Edema
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
