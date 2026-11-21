import "./globals.css";

import { Footer } from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Montserrat, Orbitron } from "next/font/google";
import type React from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const SITE_URL = "https://builder.spacebar.music";
const DESCRIPTION =
  "Create production-ready NFT metadata for Ethereum, Solana, the XRP Ledger, and more. A client-side companion to The Space Bar at spacebar.music. No backend, no accounts.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SpaceBar Metadata Builder",
    template: "%s · SpaceBar",
  },
  description: DESCRIPTION,
  applicationName: "SpaceBar Metadata Builder",
  authors: [{ name: "Bankk", url: "https://github.com/BankkRoll" }],
  creator: "Bankk",
  keywords: [
    "SpaceBar",
    "spacebar.music",
    "NFT",
    "metadata",
    "blockchain",
    "Ethereum",
    "Solana",
    "XRP",
    "XRPL",
    "IPFS",
    "web3",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "SpaceBar Metadata Builder",
    description: DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "SpaceBar",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpaceBar Metadata Builder",
    description: DESCRIPTION,
    site: "@spacebar_music",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${orbitron.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <KeyboardShortcuts />
          <Header />
          <div id="main-content">{children}</div>
          <Footer />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
