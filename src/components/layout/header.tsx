import { BrandMark } from "@/components/layout/brand-mark";
import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ExternalLink, Settings } from "lucide-react";
import Link from "next/link";

const SPACEBAR_URL = "https://www.spacebar.music";

export default function Header() {
  return (
    <header className="relative border-b border-border bg-card/95">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
      />
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BrandMark />

          <nav
            aria-label="Companion and app"
            className="flex flex-wrap items-center justify-end gap-2"
          >
            <a
              href={SPACEBAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-foreground hover:text-neon-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span>The Space Bar</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <CreateProjectDialog />
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/settings">
                <Settings className="h-4 w-4" aria-hidden="true" />
                Settings
              </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
