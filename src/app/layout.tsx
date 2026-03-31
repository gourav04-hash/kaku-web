import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/components/shared/auth-provider"
import { Navbar } from "@/components/shared/navbar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Kaku Pharmacy - Integrated Digital Healthcare",
  description: "Secure, scalable, and interoperable digital healthcare platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider session={session}>
          <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
            <Navbar />
            {children}
          </div>
        </AuthProvider>

      </body>
    </html>
  );
}
