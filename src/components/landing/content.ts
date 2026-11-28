export const LANDING_TITLE = "Earthlings Music";

export const LANDING_DESCRIPTION =
  "Artists, fans and collectors making music together, with tools built around the people who make it.";

export const DISCORD_URL = "https://discord.gg/earthlingsmusicgroup";
export const GITHUB_URL =
  "https://github.com/EarthlingsMusicGroup/EMG-NFT-Metadata-Builder";
export const SPACEBAR_URL = "https://www.spacebar.music";
export const X_URL = "https://x.com/musicearthlings";
export const INSTAGRAM_URL = "https://www.instagram.com/earthlingsmusic/";

export const E_LOGO = {
  src: "/brand/e-white.png",
  width: 561,
  height: 640,
} as const;

export const SPACEBAR_LOGO = {
  src: "/brand/spacebar-white.png",
  width: 1400,
  height: 259,
} as const;

export const HERO_CARDS = [
  {
    src: "/landing/char01.jpg",
    name: 'Jay "Buckets" Hydes',
    title: "Janitor",
    className:
      "left-0 top-[50px] w-[150px] -rotate-[8deg] min-[900px]:top-[70px] min-[900px]:w-[270px]",
  },
  {
    src: "/landing/char06.jpg",
    name: 'SpaceBar "S.B."',
    title: "Founder",
    className:
      "left-[90px] top-0 z-[2] w-[170px] min-[900px]:left-[160px] min-[900px]:w-[320px]",
  },
  {
    src: "/landing/char09.jpg",
    name: 'Agent "Agent E" Elway',
    title: "Head of Security",
    className:
      "left-[200px] top-[70px] w-[150px] rotate-[8deg] min-[900px]:left-[350px] min-[900px]:top-[100px] min-[900px]:w-[270px]",
  },
] as const;

export const CREW = [
  {
    src: "/landing/char06.jpg",
    name: 'SpaceBar "S.B."',
    title: "Founder",
  },
  {
    src: "/landing/char01.jpg",
    name: 'Jay "Buckets" Hydes',
    title: "Janitor",
  },
  {
    src: "/landing/char05.jpg",
    name: 'Bugsy "Doom" Reddick',
    title: "Executive Director",
  },
  {
    src: "/landing/char07.jpg",
    name: 'Louie "Nibbles" Cruton',
    title: "SVP of System Design",
  },
  {
    src: "/landing/char09.jpg",
    name: 'Agent "Agent E" Elway',
    title: "Head of Security",
  },
  {
    src: "/landing/char10.jpg",
    name: 'Tommy "The Bull" Starski',
    title: "Spacecraft Pilot",
  },
] as const;

export const PILLARS = [
  {
    index: "01",
    title: "Artists first",
    body: "Release tools and support designed around the people making the music.",
    swatch: "bg-[#F4A63A]",
  },
  {
    index: "02",
    title: "Fans & collectors",
    body: "Characters, collectibles and a community that grows with every release.",
    swatch: "bg-[#E8552B]",
  },
  {
    index: "03",
    title: "Built with SpaceBar.Music",
    body: "Open, practical tools from the team behind SpaceBar.Music.",
    swatch: "bg-[#2BB3A8]",
  },
] as const;

export const BUILDER_FEATURES = [
  {
    title: "100% local & private.",
    body: "Your projects stay in your browser.",
  },
  {
    title: "Drag & drop images.",
    body: "JPG, PNG, GIF or WebP.",
  },
  {
    title: "Batch edit.",
    body: "Update names, descriptions and attributes in bulk.",
  },
  {
    title: "Export anywhere.",
    body: "JSON or ZIP, ready for your chain.",
  },
] as const;

export const CHAIN_CHIPS = [
  "Ethereum",
  "Solana",
  "Polygon",
  "Base",
  "Tezos",
  "XRP",
  "+7 more",
] as const;

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#crew", label: "The Crew" },
  { href: "#builder", label: "Metadata Builder" },
  { href: "#community", label: "Community" },
] as const;

export const SOCIAL_LINKS = [
  { href: X_URL, label: "X" },
  { href: INSTAGRAM_URL, label: "Instagram" },
] as const;
