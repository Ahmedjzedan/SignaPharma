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
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-2xl bg-popover p-8 text-left shadow-2xl transition-all">
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
              <h3 className="text-2xl font-bold text-popover-foreground">
                {subject.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-medium text-foreground">
              {subject.description}
            </p>

            <div className="bg-muted rounded-xl p-4 border border-border">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Module Details
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {subject.info}
              </p>
            </div>

            {/* Stats / Metadata */}
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground py-2">
              <span className="flex items-center gap-1">
                <Book className="w-3 h-3" /> 12 Chapters
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~45h Content
              </span>
            </div>

            <div className="pt-4">
              <button className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                Study Subject <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
