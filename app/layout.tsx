import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignaPharma | The Hub",
  description: "The Pharmacist's Hub of Achievement",
};

import { auth } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
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
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
