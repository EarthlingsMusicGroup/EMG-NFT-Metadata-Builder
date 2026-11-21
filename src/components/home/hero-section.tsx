const SPACEBAR_URL = "https://www.spacebar.music";

export function HeroSection() {
  return (
    <div className="text-center">
      <p className="mb-3 font-display text-xs font-medium uppercase tracking-[0.32em] text-neon-cyan">
        Companion to The Space Bar
      </p>
      <h1 className="mb-4 text-4xl font-bold tracking-[0.08em]">
        SpaceBar Metadata Builder
      </h1>
      <p className="mx-auto mb-2 max-w-2xl text-xl text-muted-foreground">
        Create, edit, and export NFT metadata for the chains behind
        spacebar.music and the rest of the music NFT scene.
      </p>
      <p className="mx-auto max-w-xl text-sm text-muted-foreground">
        No accounts, no servers, no data collection. Your projects are stored
        locally and never leave your device.
      </p>
      <p className="mt-4">
        <a
          href={SPACEBAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 hover:decoration-neon-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          Back to spacebar.music
        </a>
      </p>
    </div>
  );
}
