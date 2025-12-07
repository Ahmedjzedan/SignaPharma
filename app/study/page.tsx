import { db } from "@/lib/db";
import { subjects } from "@/lib/db/schema";
import StudyContent, { Subject } from "./StudyContent";
import {
  FlaskConical,
  Stethoscope,
  Calculator,
  Scale,
  HeartPulse,
  Beaker,
  Activity,
  Pill,
  Syringe,
  Microscope,
  Brain,
  Dna,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "FlaskConical": <FlaskConical />,
  "Stethoscope": <Stethoscope />,
  "Calculator": <Calculator />,
  "Scale": <Scale />,
  "HeartPulse": <HeartPulse />,
  "Beaker": <Beaker />,
  "Activity": <Activity />,
  "Pill": <Pill />,
  "Syringe": <Syringe />,
  "Microscope": <Microscope />,
  "Brain": <Brain />,
  "Dna": <Dna />,
};

export default async function StudyPage() {
  const dbSubjects = await db.select().from(subjects);

  const mappedSubjects: Subject[] = dbSubjects.map((s) => ({
    id: s.id,
    title: s.name,
    description: s.description || "No description",
    info: "Detailed info coming soon...", // Not in DB yet
    icon: iconMap[s.icon || "Activity"] || <Activity />,
    colorClass: "bg-blue-50", // Default for now
    textClass: "text-medical-600",
  }));

  return <StudyContent subjects={mappedSubjects} />;
}
