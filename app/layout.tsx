// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/shared/session-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Accountant Hub — Find Accounting Jobs",
    template: "%s | Accountant Hub",
  },
  description: "The platform for accountants to find and bid on accounting jobs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-background antialiased`}>
        <SessionProvider>
          <Toaster>
            {children}
          </Toaster>
        </SessionProvider>
      </body>
    </html>
  );
}
