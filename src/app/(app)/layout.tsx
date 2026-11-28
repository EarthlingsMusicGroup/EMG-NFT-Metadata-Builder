import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { Footer } from "@/components/layout/footer";
import Header from "@/components/layout/header";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  keywords: [
    "Earthlings Music",
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
  ],
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <KeyboardShortcuts />
      <Header />
      <div id="main-content">{children}</div>
      <Footer />
    </>
  );
}
