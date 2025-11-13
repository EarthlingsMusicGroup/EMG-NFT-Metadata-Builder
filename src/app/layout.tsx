import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import type { Metadata } from "next";
import type React from "react";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NFT Metadata Builder - Production-Ready Metadata Generator",
  description:
    "Create production-ready NFT metadata for Ethereum, Solana, XRP, and more. 100% client-side, no backend required.",
  keywords: [
    "NFT",
    "metadata",
    "blockchain",
    "Ethereum",
    "Solana",
    "XRP",
    "IPFS",
    "web3",
  ],
  openGraph: {
    title: "NFT Metadata Builder",
    description: "Create production-ready NFT metadata for any blockchain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <KeyboardShortcuts />
          <Header />
          {children}
          <Footer />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
