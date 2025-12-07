import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignaPharma | The Hub",
  description: "The Pharmacist's Hub of Achievement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
