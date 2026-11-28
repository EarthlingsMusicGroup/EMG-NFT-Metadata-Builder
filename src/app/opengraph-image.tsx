import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "Earthlings Music. Artists, fans and collectors making music together.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [mark, portrait] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/e-white.png")),
    readFile(join(process.cwd(), "public/landing/char06.jpg")),
  ]);
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#121315",
          color: "#F5EFE6",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "680px",
            padding: "72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img src={markSrc} width={64} height={73} alt="" />
            <div
              style={{
                fontSize: 22,
                letterSpacing: 4,
                color: "#F4A63A",
                fontWeight: 700,
              }}
            >
              EARTHLINGS MUSIC
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>
              Earthlings Music
            </div>
            <div style={{ fontSize: 28, color: "#E9E1D4", lineHeight: 1.35 }}>
              Artists, fans and collectors making music together, with tools
              built around the people who make it.
            </div>
          </div>
          <div style={{ fontSize: 22, color: "#A8A196" }}>
            Fully open source · 13+ chains · local and private
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "520px",
            padding: "48px 48px 48px 0",
          }}
        >
          <img
            src={portraitSrc}
            width={420}
            height={525}
            alt=""
            style={{
              borderRadius: 28,
              objectFit: "cover",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
