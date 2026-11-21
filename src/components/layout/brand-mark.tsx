import { cn } from "@/lib/utils";
import Link from "next/link";

const SPACEBAR_URL = "https://www.spacebar.music";

interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Link
        href="/"
        className="max-w-[16rem] rounded-sm font-display text-sm font-bold leading-tight tracking-[0.06em] text-neon-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:[text-shadow:0_0_12px_hsl(180_100%_50%/0.55)] sm:max-w-none sm:text-base"
      >
        Earthlings Music Metadata Builder
      </Link>
      <a
        href={SPACEBAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit rounded-sm text-[11px] font-medium leading-none tracking-[0.08em] text-muted-foreground hover:text-neon-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Powered by SpaceBar.Music
      </a>
    </div>
  );
}
