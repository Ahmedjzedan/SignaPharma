import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import CasesContent, { Case } from "./CasesContent";
import { sql } from "drizzle-orm";

export default async function CasesPage() {
  // Fetch a random case from the database
  // SQLite specific random ordering
  const dbCases = await db
    .select()
    .from(cases)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (dbCases.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No cases found. Please seed the database.</p>
      </div>
    );
  }

  const dbCase = dbCases[0];

  // Parse JSON fields
  const patientData = JSON.parse(dbCase.patientData);
  const scenarioData = JSON.parse(dbCase.scenario);
  const quizData = JSON.parse(dbCase.quiz);

  const mappedCase: Case = {
    id: dbCase.id,
    title: dbCase.title,
    isUrgent: dbCase.pattern === "Hypotension" || dbCase.pattern === "Sepsis", // Simple logic for urgency
    patient: patientData,
    scenario: scenarioData,
    quiz: quizData,
  };

  return <CasesContent initialCase={mappedCase} />;
}
