import { X, Search, Plus } from "lucide-react";

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drugName: string) => void;
}

export default function AddDrugModal({
  isOpen,
  onClose,
  onAdd,
}: AddDrugModalProps) {
  if (!isOpen) return null;

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
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0 pointer-events-none">
        <div className="relative transform overflow-hidden rounded-2xl bg-card text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl pointer-events-auto border border-border">
          <div className="bg-muted px-4 py-3 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-card-foreground">Add to Cabinet</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by generic or brand name (e.g. Panadol)"
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent text-sm text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              <span className="absolute right-3 top-3 text-xs bg-muted text-muted-foreground px-2 py-1 rounded border border-border font-mono">
                OpenFDA
              </span>
            </div>

            {/* Simulated Results */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Suggestions
              </p>

              {/* Result 1 */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted border border-transparent hover:border-border transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center font-bold text-xs">
                    Pa
                  </div>
                  <div>
                    <p className="font-bold text-card-foreground text-sm">
                      Panadol{" "}
                      <span className="text-muted-foreground font-normal">
                        (Paracetamol)
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Analgesic • Antipyretic
                    </p>
                  </div>
                </div>
                <button className="text-medical-600 text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                  View Monograph
                </button>
                <button
                  onClick={() => onAdd("Panadol")}
                  className="w-8 h-8 rounded-full bg-medical-50 text-medical-600 flex items-center justify-center hover:bg-medical-600 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Result 2 */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted border border-transparent hover:border-border transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded flex items-center justify-center font-bold text-xs">
                    Pa
                  </div>
                  <div>
                    <p className="font-bold text-card-foreground text-sm">
                      Pantoprazole
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Proton Pump Inhibitor
                    </p>
                  </div>
                </div>
                <button className="text-medical-600 text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                  View Monograph
                </button>
                <button
                  onClick={() => onAdd("Pantoprazole")}
                  className="w-8 h-8 rounded-full bg-medical-50 text-medical-600 flex items-center justify-center hover:bg-medical-600 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
