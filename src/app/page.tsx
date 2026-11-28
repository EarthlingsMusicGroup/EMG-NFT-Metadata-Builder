import { LandingPage } from "@/components/landing/landing-page";
import {
  LANDING_DESCRIPTION,
  LANDING_TITLE,
} from "@/components/landing/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: LANDING_TITLE },
  description: LANDING_DESCRIPTION,
  applicationName: LANDING_TITLE,
  keywords: [
    "Earthlings Music",
    "Earthlings Music Group",
    "Metadata Builder",
    "artists",
    "Genesis Collection",
    "SpaceBar",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: LANDING_TITLE,
  },
  twitter: {
    card: "summary_large_image",
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    site: "@musicearthlings",
  },
};

export default function Page() {
  return <LandingPage />;
}
