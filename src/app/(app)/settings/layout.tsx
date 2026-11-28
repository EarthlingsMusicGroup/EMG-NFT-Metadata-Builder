import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Storage",
  description:
    "Manage IndexedDB storage for Earthlings Music Metadata Builder projects on this device.",
  alternates: {
    canonical: "/settings",
  },
  openGraph: {
    url: "/settings",
  },
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
