import {
  X,
  FlaskConical,
  AlertTriangle,
  Activity,
  Microscope,
  Pill,
} from "lucide-react";

interface DrugData {
  name: string;
  class: string;
  formula: string;
  brands: string;
  manufacturer: string;
  warnings: string;
  indications: string;
  moa: string;
  dosage: string;
}

interface ViewDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  drug: DrugData | null;
}

export default function ViewDrugModal({
  isOpen,
  onClose,
  drug,
}: ViewDrugModalProps) {
  if (!isOpen || !drug) return null;

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
      <div className="flex min-h-full items-center justify-center p-4 sm:p-0 pointer-events-none">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-4xl max-h-[90vh] flex flex-col pointer-events-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 bg-black/10 hover:bg-black/20 text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content Wrapper (Scrollable) */}
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Left Sidebar (Identity) */}
            <div className="w-full md:w-1/3 bg-slate-50 p-8 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto">
              <div className="flex flex-col items-center text-center">
                {/* Chemical Structure Placeholder */}
                <div className="w-40 h-40 bg-white border border-slate-200 rounded-xl mb-6 flex items-center justify-center p-2 shadow-sm">
                  <FlaskConical className="w-12 h-12 text-slate-300" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  {drug.name}
                </h2>
                <p className="text-sm text-slate-500 font-medium bg-slate-200 px-3 py-1 rounded-full mb-4">
                  {drug.class}
                </p>

                <div className="w-full text-left space-y-4 mt-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Formula
                    </p>
                    <p className="font-mono text-sm text-slate-700">
                      {drug.formula}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Brand Names
                    </p>
                    <p className="text-sm text-slate-700 font-medium">
                      {drug.brands}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Manufacturer(s)
                    </p>
                    <p className="text-sm text-slate-700">
                      {drug.manufacturer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content (Clinical Data) */}
            <div className="w-full md:w-2/3 p-8 overflow-y-auto custom-scrollbar bg-white">
              {/* Warning Box */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-1">
                      Boxed Warnings
                    </h4>
                    <p className="text-sm text-red-700 leading-relaxed">
                      {drug.warnings}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Indications */}
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                    <Activity className="w-5 h-5 text-medical-600" />{" "}
                    Indications & Uses
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {drug.indications}
                  </p>
                </section>

                {/* MOA */}
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                    <Microscope className="w-5 h-5 text-purple-600" />{" "}
                    Mechanism of Action
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {drug.moa}
                  </p>
                </section>

                {/* Dosage */}
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                    <Pill className="w-5 h-5 text-orange-500" /> Dosing
                    Guidelines
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 border border-slate-100 font-mono whitespace-pre-line">
                    {drug.dosage}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
