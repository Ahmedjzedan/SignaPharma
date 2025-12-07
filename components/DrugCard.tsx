import { Trash2, Zap } from "lucide-react";
import clsx from "clsx";

interface DrugCardProps {
  id: string;
  name: string;
  class: string;
  mastery: number;
  color: "blue" | "purple" | "green" | "orange";
  delay: string;
  onExam: (name: string) => void;
  onView: (name: string) => void;
  onDelete: (id: string) => void;
}

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    bar: "bg-medical-600",
    border: "hover:border-medical-200",
    shadow: "hover:shadow-medical-600/10",
    stripe: "bg-medical-600",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    bar: "bg-purple-500",
    border: "hover:border-purple-200",
    shadow: "hover:shadow-purple-600/10",
    stripe: "bg-purple-500",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    bar: "bg-green-500",
    border: "hover:border-green-200",
    shadow: "hover:shadow-green-600/10",
    stripe: "bg-green-500",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    bar: "bg-orange-500",
    border: "hover:border-orange-200",
    shadow: "hover:shadow-orange-600/10",
    stripe: "bg-orange-500",
  },
};

export default function DrugCard({
  id,
  name,
  class: drugClass,
  mastery,
  color,
  delay,
  onExam,
  onView,
  onDelete,
}: DrugCardProps) {
  const styles = colorMap[color];

  return (
    <div
      className={clsx(
        "group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-up relative overflow-hidden",
        styles.border,
        styles.shadow
      )}
      style={{ animationDelay: delay }}
    >
      <div
        className={clsx("absolute top-0 left-0 w-1 h-full", styles.stripe)}
      ></div>

      <div className="flex justify-between items-start mb-4">
        <div
          className={clsx(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            styles.bg,
            styles.text
          )}
        >
          <span className="font-bold text-lg">{name.substring(0, 2)}</span>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="text-slate-300 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">{name}</h3>
      <p className="text-xs text-slate-500 mb-4 font-mono">{drugClass}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500">Mastery Level</span>
          <span className={styles.text}>{mastery}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={clsx("h-1.5 rounded-full", styles.bar)}
            style={{ width: `${mastery}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onExam(name)}
          className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <Zap className="w-3 h-3 text-yellow-400" /> Exam
        </button>
        <button
          onClick={() => onView(name)}
          className="px-3 py-2 border border-slate-200 hover:border-medical-300 hover:text-medical-600 text-slate-600 text-xs font-bold rounded-lg transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
}
