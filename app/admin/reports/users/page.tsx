import { db } from "@/lib/db";
import { reports, users } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, X, ShieldAlert } from "lucide-react";
import { resolveReport, banUser } from "@/app/actions/admin";

export default async function AdminUserReportsPage() {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    redirect("/");
  }

  // Fetch reports for users
  // We need to join users table TWICE: once for reporter, once for target
  // Drizzle ORM requires aliasing for self-joins or multiple joins to same table
  // For simplicity, we'll fetch basic report data and then fetch user details if needed, 
  // or use raw SQL or alias if possible. 
  // Let's try a simpler approach: fetch reports where targetType is 'user', then map.
  
  const userReports = await db.select({
    id: reports.id,
    reason: reports.reason,
    targetId: reports.targetId,
    status: reports.status,
    createdAt: reports.createdAt,
    reporterName: users.name,
    reporterId: users.id,
  })
  .from(reports)
  .leftJoin(users, eq(reports.reporterId, users.id))
  .where(eq(reports.targetType, "user"))
  .orderBy(reports.createdAt);

  // Fetch target user names separately to avoid complex join alias issues for now
  const targetUserIds = userReports.map(r => r.targetId);
  const targetUsers = targetUserIds.length > 0 ? await db.select({ id: users.id, name: users.name, isBanned: users.isBanned }).from(users).where(sql`${users.id} IN ${targetUserIds}`) : [];
  const targetUserMap = new Map(targetUsers.map(u => [u.id, u]));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Reports</h1>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium">
            <tr>
              <th className="p-4">Reported User</th>
              <th className="p-4">Reporter</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {userReports.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No user reports found.
                </td>
              </tr>
            ) : (
              userReports.map((report) => {
                const targetUser = targetUserMap.get(report.targetId);
                return (
                  <tr key={report.id} className="hover:bg-muted/50">
                    <td className="p-4 font-medium">
                      {targetUser ? (
                        <Link href={`/profile/${report.targetId}`} className="text-primary hover:underline flex items-center gap-2">
                          {targetUser.name}
                          {targetUser.isBanned && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Banned</span>}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground italic">Unknown User (ID: {report.targetId})</span>
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
                              await resolveReport(report.id, "resolved");
                            }}>
                              <button className="p-2 hover:bg-green-100 rounded-full text-green-600" title="Mark Resolved">
                                <Check className="w-4 h-4" />
                              </button>
                            </form>

                            {!targetUser?.isBanned && (
                                <form action={async () => {
                                    "use server";
                                    await banUser(report.targetId);
                                    await resolveReport(report.id, "resolved");
                                }}>
                                    <button className="p-2 hover:bg-red-100 rounded-full text-red-600" title="Ban User & Resolve">
                                    <ShieldAlert className="w-4 h-4" />
                                    </button>
                                </form>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
