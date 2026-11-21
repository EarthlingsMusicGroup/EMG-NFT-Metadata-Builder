import { cn } from "@/lib/utils";
import Link from "next/link";

interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex min-w-0 flex-col gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span className="font-display text-base font-bold leading-none tracking-[0.28em] text-neon-cyan dark:[text-shadow:0_0_12px_hsl(180_100%_50%/0.55)] sm:text-lg">
        SPACEBAR
      </span>
      <span className="text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-muted-foreground">
        Metadata Builder
      </span>
    </Link>
  );
}
