"use client";

import dynamic from "next/dynamic";

const BeatBotWidget = dynamic(
  () => import("./beatbot-widget").then((mod) => mod.BeatBotWidget),
  { ssr: false, loading: () => null },
);

export function BeatBotLoader() {
  return <BeatBotWidget />;
}
