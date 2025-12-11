import { db } from "@/lib/db";
import { reports, cases, users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, Trash2, X, RotateCcw, Eye } from "lucide-react";
import { deleteContentAndResolve, restoreContentAndRevert, resolveReport } from "@/app/actions/admin";

export default async function AdminCaseReportsPage() {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    redirect("/");
  }

  // Fetch reports for cases
  const caseReports = await db.select({
    id: reports.id,
    reason: reports.reason,
    targetId: reports.targetId,
    status: reports.status,
    createdAt: reports.createdAt,
    reporterName: users.name,
    reporterId: users.id,
    caseTitle: cases.title,
    caseDeletedAt: cases.deletedAt,
  })
  .from(reports)
  .leftJoin(users, eq(reports.reporterId, users.id))
  .leftJoin(cases, eq(reports.targetId, cases.id))
  .where(eq(reports.targetType, "case"))
  .orderBy(reports.createdAt);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Case Reports</h1>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium">
            <tr>
              <th className="p-4">Case</th>
              <th className="p-4">Reporter</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {caseReports.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No case reports found.
                </td>
              </tr>
            ) : (
              caseReports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/50">
                  <td className="p-4 font-medium">
                    {report.caseTitle ? (
                      <Link href={`/cases/${report.targetId}`} className="text-primary hover:underline flex items-center gap-2">
                        {report.caseTitle}
                        {report.caseDeletedAt && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Deleted</span>}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground italic">Unknown Case (ID: {report.targetId})</span>
                    )}
                  </td>
                  <td className="p-4">
                    {report.reporterName ? (
                      <Link href={`/profile/${report.reporterId}`} className="hover:underline">
                        {report.reporterName}
                      </Link>
                    ) : (
                      "Unknown User"
                    )}
                  </td>
                  <td className="p-4 max-w-xs truncate" title={report.reason}>
                    {report.reason}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === "resolved" ? "bg-green-100 text-green-700" :
                      report.status === "dismissed" ? "bg-gray-100 text-gray-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {(report.status || "pending").charAt(0).toUpperCase() + (report.status || "pending").slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {report.status === "pending" && (
                        <>
                          <Link href={`/admin/cases/${report.targetId}/edit`} className="p-2 hover:bg-blue-100 rounded-full text-blue-600" title="Edit Case">
                            <Eye className="w-4 h-4" />
                          </Link>

                          <form action={async () => {
                            "use server";
                            await resolveReport(report.id, "dismissed");
                          }}>
                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500" title="Dismiss">
                              <X className="w-4 h-4" />
                            </button>
                          </form>
                          
                          <form action={async () => {
                            "use server";
                            await deleteContentAndResolve(report.id, report.targetId, "case");
                          }}>
                            <button className="p-2 hover:bg-red-100 rounded-full text-red-600" title="Delete & Resolve">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </>
                      )}

                      {report.status === "resolved" && report.caseDeletedAt && (
                        <form action={async () => {
                          "use server";
                          await restoreContentAndRevert(report.id, report.targetId, "case");
                        }}>
                          <button className="p-2 hover:bg-blue-100 rounded-full text-blue-600" title="Restore Content & Revert">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
