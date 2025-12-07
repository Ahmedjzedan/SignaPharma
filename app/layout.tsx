import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignaPharma | The Hub",
  description: "The Pharmacist's Hub of Achievement",
};

import { auth } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden flex flex-col min-h-screen">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
