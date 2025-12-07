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
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-0 pointer-events-none">
        <div className="relative transform overflow-hidden rounded-2xl bg-card text-left shadow-2xl transition-all sm:my-8 w-full max-w-4xl max-h-[90vh] flex flex-col pointer-events-auto border border-border">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 bg-black/10 hover:bg-black/20 text-muted-foreground rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content Wrapper (Scrollable) */}
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Left Sidebar (Identity) */}
            <div className="w-full md:w-1/3 bg-muted p-8 border-b md:border-b-0 md:border-r border-border overflow-y-auto">
              <div className="flex flex-col items-center text-center">
                {/* Chemical Structure Placeholder */}
                <div className="w-40 h-40 bg-card border border-border rounded-xl mb-6 flex items-center justify-center p-2 shadow-sm">
                  <FlaskConical className="w-12 h-12 text-muted-foreground" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {drug.name}
                </h2>
                <p className="text-sm text-muted-foreground font-medium bg-background px-3 py-1 rounded-full mb-4 border border-border">
                  {drug.class}
                </p>

                <div className="w-full text-left space-y-4 mt-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Formula
                    </p>
                    <p className="font-mono text-sm text-foreground">
                      {drug.formula}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Brand Names
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {drug.brands}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Manufacturer(s)
                    </p>
                    <p className="text-sm text-foreground">
                      {drug.manufacturer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content (Clinical Data) */}
            <div className="w-full md:w-2/3 p-8 overflow-y-auto custom-scrollbar bg-card">
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
                  <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-3">
                    <Activity className="w-5 h-5 text-medical-600" />{" "}
                    Indications & Uses
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {drug.indications}
                  </p>
                </section>

                {/* MOA */}
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-3">
                    <Microscope className="w-5 h-5 text-purple-600" />{" "}
                    Mechanism of Action
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {drug.moa}
                  </p>
                </section>

                {/* Dosage */}
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-3">
                    <Pill className="w-5 h-5 text-orange-500" /> Dosing
                    Guidelines
                  </h3>
                  <div className="bg-muted rounded-xl p-4 text-sm text-foreground border border-border font-mono whitespace-pre-line">
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
