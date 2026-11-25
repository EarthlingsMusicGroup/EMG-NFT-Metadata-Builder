export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[hsl(4_62%_46%)] text-white ${className}`}
      aria-hidden="true"
    >
      <span className="font-display text-sm font-semibold tracking-[0.08em]">
        BB
      </span>
      <span className="absolute left-1/2 top-[22%] h-1.5 w-7 -translate-x-1/2 rounded-full bg-[hsl(48_100%_50%)] ring-2 ring-[hsl(140_55%_28%)]" />
    </span>
  );
}
