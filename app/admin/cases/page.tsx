import { db } from "@/lib/db";
import { cases, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { reviewCase } from "@/app/actions/admin";
import { Check, X, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCase } from "@/app/actions/content";

export default async function CasesReviewPage() {
  const pendingCases = await db.select({
    id: cases.id,
    title: cases.title,
    difficulty: cases.difficulty,
    specialty: cases.specialty,
    authorName: users.name,
    createdAt: cases.createdAt,
    status: cases.status,
  })
  .from(cases)
  .leftJoin(users, eq(cases.authorId, users.id))
  .where(eq(cases.status, "pending"))
  .orderBy(desc(cases.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Case Review</h1>
        <p className="text-muted-foreground">Approve or reject community-submitted cases.</p>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Title</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Difficulty</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Specialty</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Author</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {pendingCases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">No pending cases.</td>
                </tr>
              ) : (
                pendingCases.map((c) => (
                  <tr key={c.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{c.title}</td>
                    <td className="p-4 align-middle">{c.difficulty}</td>
                    <td className="p-4 align-middle">{c.specialty}</td>
                    <td className="p-4 align-middle">{c.authorName || "Unknown"}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        {/* Preview Link - Assuming we have a way to view cases by ID even if pending, or we might need a special preview route */}
                        <Link href={`/cases/${c.id}`} className="p-2 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground" title="Preview">
                           <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/cases/${c.id}/edit`} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Edit Case">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteCase(c.id);
                        }}>
                          <button className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Delete Case">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                        <form action={async () => {
                          "use server";
                          await reviewCase(c.id, "rejected");
                        }}>
                          <button className="p-2 hover:bg-red-100 rounded-full text-red-600" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </form>
                        
                        <form action={async () => {
                          "use server";
                          await reviewCase(c.id, "approved");
                        }}>
                          <button className="p-2 hover:bg-green-100 rounded-full text-green-600" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
