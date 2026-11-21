import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Project",
  description:
    "Edit a SpaceBar Metadata Builder project. Data stays in this browser.",
};

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return children;
}
