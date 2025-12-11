import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { unbanUser, demoteUser } from "@/app/actions/admin";
import { Ban, ShieldOff, CheckCircle } from "lucide-react";

export default async function UsersPage() {
  const bannedUsers = await db.select().from(users).where(eq(users.isBanned, true));
  const coLeaders = await db.select().from(users).where(eq(users.role, "co-leader"));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">Manage banned users and staff roles.</p>
      </div>

      {/* Banned Users Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-destructive">
          <Ban className="w-5 h-5" /> Banned Users
        </h2>
        <div className="rounded-md border bg-card">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {bannedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-muted-foreground">No banned users.</td>
                  </tr>
                ) : (
                  bannedUsers.map((user) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{user.name}</td>
                      <td className="p-4 align-middle">{user.email}</td>
                      <td className="p-4 align-middle text-right">
                        <form action={async () => {
                          "use server";
                          await unbanUser(user.id);
                        }}>
                          <button className="flex items-center gap-2 ml-auto px-3 py-1.5 text-xs font-medium text-green-600 bg-green-100 hover:bg-green-200 rounded-md transition-colors">
                            <CheckCircle className="w-3 h-3" /> Unban
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Co-Leaders Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-orange-500">
          <ShieldOff className="w-5 h-5" /> Co-Leaders
        </h2>
        <div className="rounded-md border bg-card">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {coLeaders.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-muted-foreground">No co-leaders found.</td>
                  </tr>
                ) : (
                  coLeaders.map((user) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{user.name}</td>
                      <td className="p-4 align-middle">{user.email}</td>
                      <td className="p-4 align-middle text-right">
                        <form action={async () => {
                          "use server";
                          await demoteUser(user.id);
                        }}>
                          <button className="flex items-center gap-2 ml-auto px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors">
                            <ShieldOff className="w-3 h-3" /> Demote
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
