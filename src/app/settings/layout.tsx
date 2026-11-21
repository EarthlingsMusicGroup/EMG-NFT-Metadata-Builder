import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Storage",
  description:
    "Manage IndexedDB storage for SpaceBar Metadata Builder projects on this device.",
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
