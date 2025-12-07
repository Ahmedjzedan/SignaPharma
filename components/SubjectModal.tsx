import { X, Book, Clock, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: {
    title: string;
    description: string;
    info: string;
    icon: React.ReactNode;
    colorClass: string;
    textClass: string;
  } | null;
}

export default function SubjectModal({
  isOpen,
  onClose,
  subject,
}: SubjectModalProps) {
  if (!isOpen || !subject) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-2xl bg-white p-8 text-left shadow-2xl transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div
                className={clsx(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  subject.colorClass
                )}
              >
                <div className={clsx("w-6 h-6", subject.textClass)}>
                  {subject.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {subject.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-medium text-slate-700">
              {subject.description}
            </p>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Module Details
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {subject.info}
              </p>
            </div>

            {/* Stats / Metadata */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 py-2">
              <span className="flex items-center gap-1">
                <Book className="w-3 h-3" /> 12 Chapters
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~45h Content
              </span>
            </div>

            <div className="pt-4">
              <button className="w-full py-3.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-bold shadow-lg shadow-medical-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                Study Subject <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
