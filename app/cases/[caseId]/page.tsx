import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import CasesContent, { Case } from "../CasesContent";
import CasesSubNav from "@/components/CasesSubNav";
import { auth } from "@/lib/auth";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function CasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const session = await auth();
  let userBackground = null;
  let showOnboarding = false;

  let userElo = 1500;
  let userCasesSolved = 0;

  if (session?.user?.id) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });
    userBackground = user?.scientificBackground;
    userElo = user?.elo || 1500;
    userCasesSolved = user?.casesSolved || 0;
    if (!userBackground) {
      showOnboarding = true;
    }
  }

  const caseItem = await db.query.cases.findFirst({
    where: eq(cases.id, caseId),
  });

  if (!caseItem) {
    notFound();
  }

  // Parse JSON fields
  const patientData = JSON.parse(caseItem.patientData);
  const scenarioData = JSON.parse(caseItem.scenario);
  const quizData = JSON.parse(caseItem.quiz);

  // Shuffle options on the server to prevent hydration errors
  const shuffledOptions = [...quizData.options];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  quizData.options = shuffledOptions;

  const mappedCase: Case = {
    id: caseItem.id,
    title: caseItem.title,
    isUrgent: caseItem.pattern === "Hypotension" || caseItem.pattern === "Sepsis", // Simple logic for urgency
    patient: patientData,
    scenario: scenarioData,
    quiz: quizData,
  };

  const isLayperson = userBackground === "Layperson";

  return (
    <>
      {!isLayperson && <CasesSubNav />}
      <div className={isLayperson ? "pt-20" : "pt-28"}>
        <CasesContent 
          initialCase={mappedCase} 
          showOnboarding={showOnboarding} 
          initialElo={userElo}
          isLayperson={isLayperson}
          initialCasesSolved={userCasesSolved}
        />
      </div>
    </>
  );
}
