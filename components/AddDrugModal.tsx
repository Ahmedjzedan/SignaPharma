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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0 pointer-events-none">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl pointer-events-auto">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Add to Cabinet</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by generic or brand name (e.g. Panadol)"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent text-sm"
                autoFocus
              />
              <span className="absolute right-3 top-3 text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200 font-mono">
                OpenFDA
              </span>
            </div>

            {/* Simulated Results */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Suggestions
              </p>

              {/* Result 1 */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-xs">
                    Pa
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      Panadol{" "}
                      <span className="text-slate-400 font-normal">
                        (Paracetamol)
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
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
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded flex items-center justify-center font-bold text-xs">
                    Pa
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      Pantoprazole
                    </p>
                    <p className="text-xs text-slate-500">
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
