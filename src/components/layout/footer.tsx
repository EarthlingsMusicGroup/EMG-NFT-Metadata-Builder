"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ExternalLink, Github } from "lucide-react";

interface LinkItem {
  label: string;
  href: string;
}

interface LinkSection {
  title: string;
  links: LinkItem[];
}

const GITHUB_REPO_URL =
  "https://github.com/EarthlingsMusicGroup/EMG-NFT-Metadata-Builder";

const linkSections: LinkSection[] = [
  {
    title: "EVM-Compatible Chains",
    links: [
      {
        label: "ERC-721 (Ethereum)",
        href: "https://eips.ethereum.org/EIPS/eip-721",
      },
      { label: "ERC-721 (Polygon)", href: "https://docs.polygon.technology/" },
      { label: "ERC-721 (Base)", href: "https://docs.base.org/" },
      { label: "ERC-721 (Arbitrum)", href: "https://docs.arbitrum.io/" },
      { label: "ERC-721 (Optimism)", href: "https://docs.optimism.io/" },
      { label: "ERC-721 (Avalanche)", href: "https://docs.avax.network/" },
      { label: "ERC-721 (BSC)", href: "https://docs.bnbchain.org/" },
    ],
  },
  {
    title: "Non-EVM Chains",
    links: [
      {
        label: "Metaplex (Solana)",
        href: "https://docs.metaplex.com/programs/token-metadata/",
      },
      {
        label: "XLS-20/24d (XRP Ledger)",
        href: "https://xrpl.org/docs/tutorials/nft-tutorials/",
      },
      {
        label: "TZIP-21 (Tezos)",
        href: "https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-21/tzip-21.md",
      },
      {
        label: "CIP-25 (Cardano)",
        href: "https://cips.cardano.org/cips/cip25/",
      },
      { label: "Flow NFT Standard", href: "https://docs.onflow.org/" },
      {
        label: "NEP-171 (NEAR)",
        href: "https://github.com/near/NEPs/blob/master/neps/nep-0171.md",
      },
    ],
  },
  {
    title: "Storage & Tools",
    links: [
      { label: "IPFS", href: "https://ipfs.io/" },
      { label: "Arweave", href: "https://docs.arweave.org/" },
      { label: "Pinata", href: "https://pinata.cloud/" },
      { label: "Web3.Storage", href: "https://web3.storage/" },
      { label: "Hardhat", href: "https://hardhat.org/" },
      { label: "Remix IDE", href: "https://remix.ethereum.org/" },
    ],
  },
  {
    title: "Marketplaces & Resources",
    links: [
      { label: "OpenSea", href: "https://opensea.io/" },
      { label: "Magic Eden", href: "https://magiceden.io/" },
      { label: "Foundation", href: "https://foundation.app/" },
      { label: "Objkt (Tezos)", href: "https://objkt.com/" },
      { label: "Joepegs (Avalanche)", href: "https://joepegs.com/" },
      { label: "Paras (NEAR)", href: "https://paras.id/" },
    ],
  },
];

const standards = [
  {
    name: "ERC-721",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    name: "Metaplex",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    name: "XLS-20/24d",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    name: "TZIP-21",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  },
  {
    name: "CIP-25",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    name: "NEP-171",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  },
];

function FooterLink({ label, href }: LinkItem) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
    >
      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}

function FooterSection({ title, links }: LinkSection) {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-foreground">{title}</h3>
      <nav className="space-y-2" aria-label={title}>
        {links.map((link) => (
          <FooterLink key={link.href} {...link} />
        ))}
      </nav>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {linkSections.map((section) => (
            <FooterSection key={section.title} {...section} />
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-foreground">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A modern, production-ready NFT metadata builder supporting 13+
                blockchains with comprehensive standards coverage, IndexedDB
                storage, and a clean, intuitive interface for creating
                production-ready NFT collections.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">
                Supported Standards
              </h3>
              <div className="flex flex-wrap gap-2">
                {standards.map((standard) => (
                  <span
                    key={standard.name}
                    className={`px-2 py-1 text-xs rounded ${standard.color}`}
                  >
                    {standard.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Built with Next.js, TypeScript, Tailwind CSS, and IndexedDB •
              Supporting 13+ blockchains • 2025 NFT Standards
            </p>
            <div className="flex items-center gap-4">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1"
                aria-label="Contribute on GitHub"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>Contribute</span>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
