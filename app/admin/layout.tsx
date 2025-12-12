import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { LayoutDashboard, Flag, FileText, Users, Pill } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || (session.user.role !== "leader" && session.user.role !== "co-leader")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16 min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 fixed h-[calc(100vh-64px)] bg-card border-r border-border p-4 hidden md:block overflow-y-auto">
           <div className="mb-6 px-2">
             <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
             <p className="text-xs text-muted-foreground">Manage your community</p>
           </div>
           <nav className="space-y-1">
             <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
               <LayoutDashboard className="w-4 h-4" />
               Overview
             </Link>
             <Link href="/admin/reports" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
               <Flag className="w-4 h-4" />
               Reports
             </Link>
             <Link href="/admin/cases" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
               <FileText className="w-4 h-4" />
               Cases Review
             </Link>
             <Link href="/admin/users" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
               <Users className="w-4 h-4" />
               Users
             </Link>
             <Link href="/admin/requests" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                <Pill className="w-4 h-4" />
                Drug Requests
              </Link>
           </nav>
        </aside>
        <main className="grow md:ml-64 p-8 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
}
