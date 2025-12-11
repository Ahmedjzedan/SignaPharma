import { db } from "@/lib/db";
import { reports, cases, users } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { Flag, FileText, Users } from "lucide-react";

export default async function AdminDashboard() {
  const pendingReports = await db.select({ count: count() }).from(reports).where(eq(reports.status, "pending"));
  const pendingCases = await db.select({ count: count() }).from(cases).where(eq(cases.status, "pending"));
  const totalUsers = await db.select({ count: count() }).from(users);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of system status and pending actions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Pending Reports</h3>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{pendingReports[0].count}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </div>

        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Pending Cases</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{pendingCases[0].count}</div>
          <p className="text-xs text-muted-foreground">Awaiting approval</p>
        </div>

        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Users</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalUsers[0].count}</div>
          <p className="text-xs text-muted-foreground">Registered members</p>
        </div>
      </div>
    </div>
  );
}
