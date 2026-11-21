const SPACEBAR_URL = "https://www.spacebar.music";

export function HeroSection() {
  return (
    <div className="text-center">
      <h1 className="mb-3 text-3xl font-bold tracking-[0.04em] sm:text-4xl">
        Earthlings Music Metadata Builder
      </h1>
      <p className="mb-4">
        <a
          href={SPACEBAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-xs font-medium uppercase tracking-[0.22em] text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 hover:decoration-neon-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm sm:text-sm sm:tracking-[0.28em]"
        >
          Powered by SpaceBar.Music
        </a>
      </p>
      <p className="mx-auto mb-2 max-w-2xl text-xl text-muted-foreground">
        Create, edit, and export NFT metadata for the chains behind
        spacebar.music and the rest of the music NFT scene.
      </p>
      <p className="mx-auto max-w-xl text-sm text-muted-foreground">
        No accounts, no servers, no data collection. Your projects are stored
        locally and never leave your device.
      </p>
    </div>
  );
}
