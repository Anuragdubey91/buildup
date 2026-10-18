import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuildUp — Find Your Team. Build Your Dream.",
  description:
    "The complete full-stack startup collaboration platform. Validate startup ideas with AI, find complementary co-founders, identify skill gaps, and protect confidential work with IdeaShield.",
  keywords: [
    "startup incubator",
    "co-founder matching",
    "idea validator",
    "startup roadmap",
    "equity calculator",
    "student entrepreneurship",
    "IdeaShield",
  ],
  authors: [{ name: "BuildUp Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <PersonaSwitcher />
        </ToastProvider>
      </body>
    </html>
  );
}
