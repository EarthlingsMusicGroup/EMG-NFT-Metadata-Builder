import { BrandMark } from "@/components/layout/brand-mark";
import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Settings } from "lucide-react";
import Link from "next/link";

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
            aria-label="App"
            className="flex flex-wrap items-center justify-end gap-2"
          >
            <span data-beatbot="create-project" className="inline-flex">
              <CreateProjectDialog />
            </span>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/settings" data-beatbot="settings">
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
