import { ImageResponse } from "next/og";

export const alt =
  "Earthlings Music Metadata Builder - Powered by SpaceBar.Music";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1a1a1a",
          padding: "72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            left: 260,
            width: 680,
            height: 440,
            borderRadius: 9999,
            background: "rgba(157, 78, 221, 0.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -20,
            width: 380,
            height: 260,
            borderRadius: 9999,
            background: "rgba(0, 255, 255, 0.16)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            color: "#39FF14",
            fontWeight: 700,
          }}
        >
          POWERED BY SPACEBAR.MUSIC
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#5CFFFF",
            }}
          >
            EARTHLINGS MUSIC
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: "#F4F1FF",
              letterSpacing: 2,
            }}
          >
            Metadata Builder
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#D5D3E4" }}>
          Earthlings Music Metadata Builder - Powered by SpaceBar.Music
        </div>
      </div>
    ),
    { ...size },
  );
}
