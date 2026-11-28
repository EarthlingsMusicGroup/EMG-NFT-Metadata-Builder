import { LandingNav } from "@/components/landing/landing-nav";
import {
  BUILDER_FEATURES,
  CHAIN_CHIPS,
  CREW,
  DISCORD_URL,
  E_LOGO,
  GITHUB_URL,
  HERO_CARDS,
  INSTAGRAM_URL,
  PILLARS,
  SPACEBAR_LOGO,
  SPACEBAR_URL,
  X_URL,
} from "@/components/landing/content";
import Link from "next/link";
import type { ReactNode } from "react";

const wrap = "mx-auto w-full max-w-[1200px] px-5 min-[900px]:px-8";

function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.16em] text-[#F4A63A] min-[900px]:tracking-[0.3em] ${className}`}
    >
      <span aria-hidden className="h-0.5 w-6 shrink-0 bg-[#F4A63A] min-[900px]:w-[34px]" />
      {children}
    </p>
  );
}

function PrimaryLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#F4A63A] px-6 py-3.5 text-[15px] font-bold text-[#16120B] shadow-[0_10px_30px_rgba(244,166,58,0.35)] hover:bg-[#FFC15E] active:bg-[#E0942E] min-[900px]:w-auto";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function GhostLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-[#F5EFE6]/40 bg-white/[0.04] px-6 py-3.5 text-[15px] font-bold text-[#F5EFE6] hover:border-[#F5EFE6]/80 hover:bg-white/10 min-[900px]:w-auto";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 5.064-6.933Zm-1.291 19.49h2.039L6.486 3.24H4.298l13.312 17.403Z"
      />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
      />
    </svg>
  );
}

function SocialNav({ label, className = "" }: { label: string; className?: string }) {
  const linkClass =
    "inline-flex h-12 w-12 items-center justify-center rounded-xl text-[#F4A63A] hover:bg-[#F4A63A]/15 hover:text-[#FFC15E] focus-visible:outline-none";
  return (
    <nav aria-label={label} className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Earthlings on X"
        className={linkClass}
      >
        <XLogo />
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Earthlings on Instagram"
        className={linkClass}
      >
        <InstagramLogo />
      </a>
    </nav>
  );
}

export function LandingPage() {
  return (
    <div className="em-landing relative min-h-dvh overflow-x-clip bg-[#121315] font-sans text-[#F5EFE6]">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#121315]" />
      <LandingNav />
      <main id="main-content">
        <section
          className="em-hero relative overflow-hidden pb-[60px] pt-[110px] min-[900px]:pb-[110px] min-[900px]:pt-[150px]"
          aria-labelledby="landing-title"
        >
          <div aria-hidden className="em-hero-grain pointer-events-none absolute inset-0" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px] bg-gradient-to-b from-transparent to-[#121315]"
          />
          <div
            className={`${wrap} relative z-[1] grid items-center gap-8 min-[900px]:grid-cols-[1.05fr_0.95fr] min-[900px]:gap-10`}
          >
            <div data-beatbot="landing-hero">
              <Eyebrow className="mb-[22px]">Artists, fans and collectors</Eyebrow>
              <h1
                id="landing-title"
                className="mb-[22px] font-display text-[44px] font-black leading-[1.02] tracking-[0.01em] min-[900px]:text-[76px]"
              >
                Earthlings <span className="text-[#F4A63A]">Music</span>
              </h1>
              <p className="mb-8 max-w-[520px] text-[16.5px] leading-relaxed text-[#E9E1D4] min-[900px]:text-[19px]">
                Artists, fans and collectors making music together, with tools
                built around the people who make it.
              </p>
              <div className="flex flex-col gap-3.5 min-[900px]:flex-row min-[900px]:flex-wrap">
                <PrimaryLink href="/builder">
                  Open the Metadata Builder
                  <span aria-hidden>→</span>
                </PrimaryLink>
                <GhostLink href={DISCORD_URL} external>
                  Join the Discord
                </GhostLink>
              </div>
              <ul className="mt-8 flex gap-5 text-[13px] text-[#C4BBAE] min-[900px]:mt-11 min-[900px]:gap-8">
                <li>
                  <span className="block font-display text-[22px] font-bold text-[#F5EFE6]">
                    Fully
                  </span>
                  open source
                </li>
                <li>
                  <span className="block font-display text-[22px] font-bold tabular-nums text-[#F5EFE6]">
                    13+
                  </span>
                  chains supported
                </li>
                <li>
                  <span className="block font-display text-[22px] font-bold tabular-nums text-[#F5EFE6]">
                    100%
                  </span>
                  local &amp; private
                </li>
              </ul>
            </div>

            <div className="relative h-[340px] min-[900px]:h-[600px]">
              {HERO_CARDS.map((card, index) => (
                <div
                  key={card.src}
                  className={`absolute aspect-[4/5] overflow-hidden rounded-[18px] border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.55)] ${card.className}`}
                >
                  <img
                    src={card.src}
                    alt={`${card.name}, ${card.title}`}
                    width={864}
                    height={1080}
                    fetchPriority={index === 1 ? "high" : "auto"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              <p className="absolute bottom-0 left-4 z-[3] hidden items-center gap-3 rounded-[14px] border border-[#2A2B30] bg-[#121315]/85 px-[18px] py-3 text-[13px] text-[#C4BBAE] backdrop-blur-md min-[900px]:flex">
                <img
                  src={E_LOGO.src}
                  alt=""
                  width={E_LOGO.width}
                  height={E_LOGO.height}
                  className="h-[34px] w-auto"
                />
                Earthlings Genesis Collection
              </p>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-6 bg-[#121315] py-[62px] min-[900px]:py-24"
          aria-labelledby="about-title"
        >
          <div className={wrap}>
            <div className="mb-10 max-w-[640px] min-[900px]:mb-[46px]" data-beatbot="landing-about">
              <Eyebrow className="mb-3.5">About</Eyebrow>
              <h2
                id="about-title"
                className="mb-3.5 font-display text-[27px] font-bold leading-[1.15] min-[900px]:text-[38px]"
              >
                Music with a little more gravity.
              </h2>
              <p className="text-[15.5px] leading-relaxed text-[#C4BBAE] min-[900px]:text-[17px]">
                Earthlings Music is a community driven by artists, where they
                own their story and fans take part in it. Every release, character
                and tool is built with the same idea: make it easy to create,
                easy to share, and yours to keep.
              </p>
            </div>
            <ul className="grid gap-[22px] min-[900px]:grid-cols-3">
              {PILLARS.map((pillar) => (
                <li
                  key={pillar.index}
                  className="rounded-[18px] border border-[#2A2B30] bg-[#1C1D21] p-[30px]"
                >
                  <span
                    className={`mb-[18px] grid h-[46px] w-[46px] place-items-center rounded-xl font-display text-sm font-bold text-[#16120B] ${pillar.swatch}`}
                  >
                    {pillar.index}
                  </span>
                  <h3 className="mb-2 font-display text-[17px] font-bold">
                    {pillar.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#C4BBAE]">
                    {pillar.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="crew"
          className="scroll-mt-6 border-y border-[#2A2B30] bg-[#17181B] py-[62px] min-[900px]:py-24"
          aria-labelledby="crew-title"
        >
          <div className={wrap}>
            <div className="mb-10 max-w-[640px] min-[900px]:mb-[46px]" data-beatbot="landing-crew">
              <Eyebrow className="mb-3.5">The Crew</Eyebrow>
              <h2
                id="crew-title"
                className="mb-3.5 font-display text-[27px] font-bold leading-[1.15] min-[900px]:text-[38px]"
              >
                Meet the Earthlings.
              </h2>
              <p className="text-[15.5px] leading-relaxed text-[#C4BBAE] min-[900px]:text-[17px]">
                Twenty-eight characters, each with their own title, traits and
                story. Here are a few faces from the Genesis Collection.
              </p>
            </div>
            <div className="relative min-w-0">
              <ul
                className="flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 min-[900px]:grid min-[900px]:grid-cols-6 min-[900px]:gap-4 min-[900px]:overflow-visible min-[900px]:pb-0"
                tabIndex={0}
                aria-label="Genesis characters"
              >
                {CREW.map((character) => (
                  <li
                    key={character.name}
                    className="relative aspect-[3/4.2] w-[150px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#2A2B30] min-[900px]:w-auto"
                  >
                    <img
                      src={character.src}
                      alt={`${character.name}, ${character.title}`}
                      width={864}
                      height={1080}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-b from-transparent from-55% to-[rgba(10,10,12,0.92)]"
                    />
                    <p className="absolute inset-x-3 bottom-3 z-[1] text-[12.5px] leading-snug">
                      <span className="block font-display text-xs font-bold tracking-[0.02em]">
                        {character.name}
                      </span>
                      <span className="text-[11px] text-[#F4A63A]">
                        {character.title}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#17181B] min-[900px]:hidden"
              />
            </div>
            <p className="mt-6 text-sm text-[#C4BBAE]">
              + 22 more characters in the Genesis Collection
            </p>
          </div>
        </section>

        <section
          id="builder"
          className="scroll-mt-6 bg-[#121315] py-[62px] min-[900px]:py-24"
          aria-labelledby="builder-title"
        >
          <div
            className={`${wrap} grid items-center gap-8 min-[900px]:grid-cols-[0.9fr_1.1fr] min-[900px]:gap-14`}
          >
            <div data-beatbot="landing-builder">
              <Eyebrow className="mb-3.5">For artists &amp; creators</Eyebrow>
              <h2
                id="builder-title"
                className="mb-3.5 font-display text-[27px] font-bold leading-[1.15] min-[900px]:text-[38px]"
              >
                The Earthlings Music{" "}
                <span className="text-[#F4A63A]">Metadata Builder</span>
              </h2>
              <p className="text-[15.5px] leading-relaxed text-[#C4BBAE] min-[900px]:text-[17px]">
                Create, edit and export metadata for your music on the chains
                you release on. No accounts, no servers, no data collection.
              </p>
              <ul className="my-6 grid gap-3.5 min-[900px]:my-8">
                {BUILDER_FEATURES.map((feature) => (
                  <li
                    key={feature.title}
                    className="flex items-start gap-3.5 text-[15.5px] text-[#E5DED2]"
                  >
                    <span
                      aria-hidden
                      className="mt-px grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-[#F4A63A]/15 text-[13px] font-bold text-[#F4A63A]"
                    >
                      ✓
                    </span>
                    <span>
                      <span className="font-bold text-[#F5EFE6]">{feature.title}</span>{" "}
                      {feature.body}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3.5 min-[900px]:flex-row min-[900px]:flex-wrap">
                <PrimaryLink href="/builder">
                  Create a Project
                  <span aria-hidden>→</span>
                </PrimaryLink>
                <GhostLink href="/builder#how-it-works">
                  See how it works
                </GhostLink>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Chains">
                {CHAIN_CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-md border border-[#2A2B30] bg-[#25262B] px-[11px] py-[5px] text-[11.5px] font-semibold text-[#CFC8BB]"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-10 bg-[radial-gradient(closest-side,rgba(244,166,58,0.28),transparent)]"
              />
              <div className="relative overflow-hidden rounded-[14px] border border-[#34353B] bg-[#0E0F11] shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                <div className="flex h-9 items-center gap-[7px] bg-[#202126] px-3.5">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#44464D]" />
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#44464D]" />
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#44464D]" />
                  <span className="ml-3.5 flex h-[22px] flex-1 items-center rounded-md bg-[#14151A] pl-3 text-[11px] text-[#8D8A84]">
                    earthlingsmusic.com/builder
                  </span>
                </div>
                <img
                  src="/landing/builder-fold.jpg"
                  alt="The Metadata Builder, open in the browser"
                  width={1280}
                  height={800}
                  className="block aspect-[16/10] w-full bg-[#141416] object-cover object-top"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="community"
          className="scroll-mt-6 bg-gradient-to-b from-[#121315] to-[#17130F] py-[62px] min-[900px]:py-24"
          aria-labelledby="community-title"
        >
          <div className={wrap}>
            <div className="mb-10 max-w-[640px] min-[900px]:mb-[46px]" data-beatbot="landing-community">
              <Eyebrow className="mb-3.5">Community</Eyebrow>
              <h2
                id="community-title"
                className="mb-3.5 font-display text-[27px] font-bold leading-[1.15] min-[900px]:text-[38px]"
              >
                Come hang with the Earthlings.
              </h2>
              <p className="text-[15.5px] leading-relaxed text-[#C4BBAE] min-[900px]:text-[17px]">
                New music, hangouts and builder help happen in the community.
                Jump in.
              </p>
            </div>
            <ul className="grid gap-[22px] min-[900px]:grid-cols-[1.3fr_1fr_1fr]">
              <li className="flex flex-col gap-3 rounded-[20px] border border-[#3A3F8F] bg-gradient-to-br from-[#2A2F6E] via-[#1D2050] to-[#16172E] p-8">
                <p className="text-xs tracking-[0.08em] text-[#AAB0FF]">DISCORD</p>
                <h3 className="font-display text-xl font-bold">Earthlings Music Group</h3>
                <p className="flex-1 text-[15px] leading-relaxed text-[#C3BDB1]">
                  Our home base. Meet the crew, hear new music first, share your
                  work and get help with the Metadata Builder.
                </p>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-[#1B1E4D] hover:bg-[#F4EFE6] min-[900px]:w-auto min-[900px]:self-start"
                >
                  Join the Discord
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li className="flex flex-col gap-3 rounded-[20px] border border-[#2A2B30] bg-[#1C1D21] p-8">
                <p className="text-xs tracking-[0.08em] text-[#F4A63A]">OPEN SOURCE</p>
                <h3 className="font-display text-xl font-bold">Builder on GitHub</h3>
                <p className="flex-1 text-[15px] leading-relaxed text-[#C3BDB1]">
                  The Metadata Builder is open source. Read the code, report an
                  issue, or contribute.
                </p>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-[#F4A63A] hover:text-[#FFC15E]"
                >
                  View on GitHub →
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li className="flex flex-col gap-3 rounded-[20px] border border-[#4B4A54] bg-black p-8">
                <p className="text-xs tracking-[0.08em] text-[#82A0AA]">PARTNER</p>
                <img
                  src={SPACEBAR_LOGO.src}
                  alt="SpaceBar"
                  width={SPACEBAR_LOGO.width}
                  height={SPACEBAR_LOGO.height}
                  className="mt-1 h-[34px] w-auto self-start"
                />
                <p className="flex-1 text-[15px] leading-relaxed text-[#82A0AA]">
                  The music platform powering our tools.
                </p>
                <a
                  href={SPACEBAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-[#9296F0] hover:text-[#B7BAFF]"
                >
                  Visit SpaceBar.Music →
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <SocialNav label="Community social" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#4B4A54] bg-black px-0 pb-28 pt-[46px] min-[900px]:pb-[54px]">
        <div className={`${wrap} flex flex-col items-start justify-between gap-8 min-[900px]:flex-row min-[900px]:items-center`}>
          <div className="flex items-center gap-4">
            <img
              src={E_LOGO.src}
              alt=""
              width={E_LOGO.width}
              height={E_LOGO.height}
              className="h-16 w-auto min-[900px]:h-[72px]"
            />
            <div>
              <p className="font-display text-[13px] font-bold tracking-[0.12em]">
                EARTHLINGS MUSIC GROUP
              </p>
              <p className="text-[13px] text-[#C4BBAE]">
                A Web3 community driven by artists
              </p>
            </div>
          </div>
          <div className="text-left text-[13px] text-[#82A0AA] min-[900px]:text-right">
            <a
              href={SPACEBAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 inline-flex min-h-11 items-center gap-3.5 py-1 text-[13px] font-medium text-white hover:text-[#F5EFE6]"
            >
              <span>Powered by</span>
              <img
                src={SPACEBAR_LOGO.src}
                alt="SpaceBar"
                width={SPACEBAR_LOGO.width}
                height={SPACEBAR_LOGO.height}
                className="h-[30px] w-auto"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p>Built with Next.js · stored locally in your browser</p>
            <SocialNav
              label="Footer social"
              className="min-[900px]:justify-end"
            />
            <p className="mt-1">© 2026 Earthlings Music Group</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
