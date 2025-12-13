import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignaPharma | The Hub",
  description: "The Pharmacist's Hub of Achievement",
};

import { auth } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";

  // Simple check to prevent infinite redirect loop if we were to redirect to /auth
  // But headers() in layout might not give pathname reliably in all deployments.
  // However, for local dev it might work or we can just check session.
  
  if (session?.user?.isBanned) {
     // We need to allow them to sign out or see the banned message.
     // If we redirect to /auth, we must ensure /auth doesn't use this layout or handles it.
     // RootLayout wraps everything.
     // So we should probably check if we are already on /auth.
     // But getting pathname in Server Component layout is tricky without middleware.
     // Let's just render a "Banned" screen if banned, instead of redirecting.
  }
  
  if (session?.user?.isBanned) {
    return (
      <html lang="en">
        <body className="antialiased flex flex-col min-h-screen items-center justify-center bg-background text-foreground">
          <div className="p-8 text-center space-y-4">
            <h1 className="text-3xl font-bold text-destructive">Account Suspended</h1>
            <p>Your account has been banned due to violations of our community guidelines.</p>
            <form action={async () => {
              "use server";
              // We need to import signOut from auth, but we can't call it directly in form action if it's not bound.
              // Actually we can just use a link to /api/auth/signout or similar.
              // Or better, just tell them to contact support.
            }}>
               <p className="text-sm text-muted-foreground">Contact support if you believe this is an error.</p>
            </form>
          </div>
        </body>
      </html>
    );
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden flex flex-col min-h-screen">
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ToastProvider />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
