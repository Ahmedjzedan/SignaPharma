import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CaseForm from "@/components/CaseForm";
import { updateCase } from "@/app/actions/content";

export default async function EditCasePage({ params }: { params: Promise<{ caseId: string }> }) {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    redirect("/");
  }

  const { caseId } = await params;
  const caseItem = await db.query.cases.findFirst({
    where: eq(cases.id, caseId),
  });

  if (!caseItem) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold mb-4">Case Not Found</h1>
        <Link href="/admin/cases" className="text-primary hover:underline">Back to Admin</Link>
      </div>
    );
  }

  // Parse JSON data for the form
  const initialData = {
    title: caseItem.title,
    description: caseItem.description,
    difficulty: caseItem.difficulty,
    category: caseItem.category,
    patientData: JSON.parse(caseItem.patientData),
    scenario: JSON.parse(caseItem.scenario),
    quiz: JSON.parse(caseItem.quiz),
  };

  async function handleUpdate(data: any) {
    "use server";
    // We need to stringify the JSON fields again
    const updateData = {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      category: data.category,
      patientData: JSON.stringify(data.patientData),
      scenario: JSON.stringify(data.scenario),
      quiz: JSON.stringify(data.quiz),
    };
    
    return await updateCase(caseId, updateData);
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/cases" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Admin Cases
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Case</h1>
          <p className="text-muted-foreground">
            Editing case: {caseItem.title}
          </p>
        </div>

        <CaseForm initialData={initialData} onSubmit={handleUpdate} isEditing={true} />
      </div>
    </div>
  );
}
