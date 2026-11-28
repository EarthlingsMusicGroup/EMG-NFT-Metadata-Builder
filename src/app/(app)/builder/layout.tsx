import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/builder",
  },
  openGraph: {
    url: "/builder",
  },
};

export default function BuilderLayout({ children }: { children: ReactNode }) {
  return children;
}
