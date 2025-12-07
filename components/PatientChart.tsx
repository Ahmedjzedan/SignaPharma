import { Heart, Activity, Thermometer } from "lucide-react";

interface PatientChartProps {
  patient: {
    name: string;
    dob: string;
    age: number;
    allergy: string;
  };
  vitals: {
    hr: number;
    bp: string;
    temp: number;
  };
  history: {
    hpi: string;
    pmh: string[];
    meds: string[];
  };
  progress: {
    current: number;
    total: number;
  };
}

export default function PatientChart({
  patient,
  vitals,
  history,
  progress,
}: PatientChartProps) {
  return (
    <aside className="lg:w-1/3 flex-shrink-0">
      <div className="lg:sticky lg:top-24 space-y-6">
        {/* Patient ID Card */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden relative">
          {/* Chart Header */}
          <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h2 className="font-bold text-sm">{patient.name}</h2>
                <p className="text-xs text-slate-400">
                  DOB: {patient.dob} ({patient.age}y)
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-red-500/20 text-red-100 text-xs px-2 py-1 rounded border border-red-500/30">
                ALLERGY: {patient.allergy}
              </span>
            </div>
          </div>

          {/* Vitals Section */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1 font-semibold uppercase">
                <Heart className="w-3 h-3 text-red-500 animate-pulse" /> HR
              </div>
              <span className="text-2xl font-mono font-bold text-slate-900">
                {vitals.hr}
              </span>
              <span className="text-xs text-slate-400 block">bpm</span>
            </div>
            <div className="p-4 text-center bg-red-50/50">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1 font-semibold uppercase">
                <Activity className="w-3 h-3 text-blue-500" /> BP
              </div>
              <span className="text-2xl font-mono font-bold text-red-600">
                {vitals.bp}
              </span>
              <span className="text-xs text-slate-400 block">mmHg</span>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1 font-semibold uppercase">
                <Thermometer className="w-3 h-3 text-orange-500" /> Temp
              </div>
              <span className="text-2xl font-mono font-bold text-slate-900">
                {vitals.temp}
              </span>
              <span className="text-xs text-slate-400 block">°C</span>
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="p-6 chart-paper min-h-[300px]">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-3 border-b border-slate-200 pb-2">
              History of Present Illness
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed mb-4 font-serif">
              {history.hpi}
            </p>

            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-3 border-b border-slate-200 pb-2 pt-2">
              PMH
            </h3>
            <ul className="text-sm text-slate-700 list-disc list-inside mb-4 font-serif space-y-1">
              {history.pmh.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-3 border-b border-slate-200 pb-2 pt-2">
              Home Meds
            </h3>
            <ul className="text-sm text-slate-700 list-disc list-inside font-serif space-y-1">
              {history.meds.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Progress Bar (Context) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase">
            Case Progress
          </span>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-medical-600 rounded-full transition-all duration-500"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            ></div>
          </div>
          <span className="text-xs font-bold text-medical-600">
            Stage {progress.current}/{progress.total}
          </span>
        </div>
      </div>
    </aside>
  );
}
