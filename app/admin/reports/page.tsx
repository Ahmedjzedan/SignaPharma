import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { eq, count, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Users, AlertTriangle, ChevronRight } from "lucide-react";

export default async function AdminReportsPage() {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    redirect("/");
  }

  // Get counts
  const pendingCaseReports = await db.select({ count: count() }).from(reports).where(and(eq(reports.targetType, "case"), eq(reports.status, "pending")));
  const pendingBlogReports = await db.select({ count: count() }).from(reports).where(and(eq(reports.targetType, "blog"), eq(reports.status, "pending")));
  const pendingUserReports = await db.select({ count: count() }).from(reports).where(and(eq(reports.targetType, "user"), eq(reports.status, "pending")));

  const cards = [
    {
      title: "Case Reports",
      description: "Reports on clinical cases",
      icon: AlertTriangle,
      href: "/admin/reports/cases",
      count: pendingCaseReports[0].count,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Blog Reports",
      description: "Reports on blog posts and rants",
      icon: FileText,
      href: "/admin/reports/blogs",
      count: pendingBlogReports[0].count,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "User Reports",
      description: "Reports on user profiles",
      icon: Users,
      href: "/admin/reports/users",
      count: pendingUserReports[0].count,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link 
            key={card.title} 
            href={card.href}
            className="block p-6 bg-card border border-border rounded-xl hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              {card.count > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-destructive text-destructive-foreground">
                  {card.count} Pending
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
              {card.title}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
            <p className="text-muted-foreground text-sm">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
