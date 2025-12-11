import { Activity, Heart, Thermometer, User } from 'lucide-react';
import ReportButton from './ReportButton';

interface PatientChartProps {
  caseId: string;
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
  caseId,
  patient,
  vitals,
  history,
  progress,
}: PatientChartProps) {
  return (
    <aside className="lg:w-1/3 shrink-0">
      <div className="lg:sticky lg:top-24 space-y-6">
        {/* Patient ID Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative">
          {/* Chart Header */}
          <div className="bg-muted p-4 flex justify-between items-center text-foreground">
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center border-2 border-medical-200 dark:border-medical-800">
                  <User className="w-8 h-8 text-medical-600 dark:text-medical-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm">{patient.name}</h2>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    {patient.age}y
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  DOB: {patient.dob}
                </p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="bg-red-100 text-red-700 font-bold text-xs px-2 py-1 rounded border border-red-200">
                ALLERGY: {patient.allergy}
              </span>
              <ReportButton targetId={caseId} targetType="case" variant="text" className="text-[10px] px-0 py-0 h-auto" />
            </div>
          </div>

          {/* Vitals Section */}
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-card">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1 font-semibold uppercase">
                <Heart className="w-3 h-3 text-red-500 animate-pulse" /> HR
              </div>
              <span className="text-2xl font-mono font-bold text-card-foreground">
                {vitals.hr}
              </span>
              <span className="text-xs text-muted-foreground block">bpm</span>
            </div>
            <div className="p-4 text-center bg-red-500/10">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1 font-semibold uppercase">
                <Activity className="w-3 h-3 text-blue-500" /> BP
              </div>
              <span className="text-2xl font-mono font-bold text-red-500">
                {vitals.bp}
              </span>
              <span className="text-xs text-muted-foreground block">mmHg</span>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1 font-semibold uppercase">
                <Thermometer className="w-3 h-3 text-orange-500" /> Temp
              </div>
              <span className="text-2xl font-mono font-bold text-card-foreground">
                {vitals.temp}
              </span>
              <span className="text-xs text-muted-foreground block">°C</span>
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="p-6 min-h-[300px] bg-card">
            <h3 className="font-bold text-card-foreground text-sm uppercase tracking-wide mb-3 border-b border-border pb-2">
              History of Present Illness
            </h3>
            <p className="text-foreground text-sm leading-relaxed mb-4 font-serif">
              {history.hpi}
            </p>

            <h3 className="font-bold text-card-foreground text-sm uppercase tracking-wide mb-3 border-b border-border pb-2 pt-2">
              PMH
            </h3>
            <ul className="text-sm text-foreground list-disc list-inside mb-4 font-serif space-y-1">
              {history.pmh.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="font-bold text-card-foreground text-sm uppercase tracking-wide mb-3 border-b border-border pb-2 pt-2">
              Home Meds
            </h3>
            <ul className="text-sm text-foreground list-disc list-inside font-serif space-y-1">
              {history.meds.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Progress Bar (Context) */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            Case Progress
          </span>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
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
