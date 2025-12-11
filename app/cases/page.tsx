import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import CasesContent, { Case } from "./CasesContent";
import CasesSubNav from "@/components/CasesSubNav";
import { sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { users, recentCases } from "@/lib/db/schema";
import { eq, notInArray, and, ne, between, gte, isNull } from "drizzle-orm";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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

  // Fetch a random case from the database
  // SQLite specific random ordering
  // Fetch recent cases to exclude
  let excludedCaseIds: string[] = [];
  if (session?.user?.id) {
    const recent = await db.select({ caseId: recentCases.caseId }).from(recentCases).where(eq(recentCases.userId, session.user.id));
    excludedCaseIds = recent.map(r => r.caseId).filter((id): id is string => !!id);
  }

  // Filters from URL
  const resolvedSearchParams = await searchParams;
  const specialty = resolvedSearchParams?.specialty;
  const difficulty = resolvedSearchParams?.difficulty;
  const scenario = resolvedSearchParams?.scenario;

  // Base conditions
  const conditions = [];

  if (excludedCaseIds.length > 0) {
    conditions.push(notInArray(cases.id, excludedCaseIds));
  }

  if (specialty) {
    conditions.push(eq(cases.specialty, specialty as string));
  }
  
  if (difficulty) {
    const diffStr = difficulty as string;
    if (diffStr === "Intern") {
      conditions.push(between(cases.difficulty, 800, 1200));
    } else if (diffStr === "Resident") {
      conditions.push(between(cases.difficulty, 1200, 1800));
    } else if (diffStr === "Attending") {
      conditions.push(gte(cases.difficulty, 1800));
    }
    // "Auto" or unknown values will result in no specific difficulty filter
  }

  if (scenario) {
    conditions.push(eq(cases.scenarioType, scenario as string));
  }

  if (userBackground === "Layperson") {
    conditions.push(eq(cases.targetAudience, "Layperson"));
  } else {
    // Professional or Student
    if (userElo > 1200) {
      conditions.push(ne(cases.targetAudience, "Layperson"));
    }
  }

  // Build query
  let query = db.select({
    caseData: cases,
    authorName: users.name
  })
  .from(cases)
  .leftJoin(users, eq(cases.authorId, users.id));

  // Add deletedAt check
  conditions.push(isNull(cases.deletedAt));
  // Add status check - only show approved cases or cases created by seed (which might not have status or have 'approved')
  // Assuming seed cases have status 'approved' or null (if schema default is not set or old data)
  // Let's assume we only show 'approved' cases.
  // conditions.push(eq(cases.status, 'approved')); 
  // Wait, existing seed data might not have status set. Let's check schema default.
  // Schema says: status: text("status").default("approved").notNull()
  // So we should filter by status = 'approved'.
  conditions.push(eq(cases.status, 'approved'));

  if (conditions.length > 0) {
    // @ts-ignore
    query = query.where(and(...conditions));
  }

  // @ts-ignore
  query = query.orderBy(sql`RANDOM()`).limit(1);

  const dbCases = await query;

  if (dbCases.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No cases found. Please seed the database.</p>
      </div>
    );
  }

  const { caseData: dbCase, authorName } = dbCases[0];

  // Parse JSON fields
  const patientData = JSON.parse(dbCase.patientData);
  const scenarioData = JSON.parse(dbCase.scenario);
  const quizData = JSON.parse(dbCase.quiz);

  // Shuffle options on the server to prevent hydration errors
  const shuffledOptions = [...quizData.options];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  quizData.options = shuffledOptions;

  const mappedCase: Case = {
    id: dbCase.id,
    title: dbCase.title,
    isUrgent: dbCase.pattern === "Hypotension" || dbCase.pattern === "Sepsis", // Simple logic for urgency
    patient: patientData,
    scenario: scenarioData,
    quiz: quizData,
    authorName: authorName || undefined,
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
