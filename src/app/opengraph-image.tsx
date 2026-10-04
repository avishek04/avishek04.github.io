import { ImageResponse } from "next/og";

export const alt = "Avishek Choudhury, Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

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
          background: "#f5f4ef",
          color: "#151714",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 260,
            right: -110,
            top: -230,
            background: "rgba(36, 88, 211, 0.11)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(21,23,20,.18)", paddingTop: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: "#151714", color: "#f5f4ef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>AC</div>
            <div style={{ fontSize: 18, letterSpacing: 1.5, textTransform: "uppercase" }}>Portfolio · 2026</div>
          </div>
          <div style={{ fontSize: 17, color: "#61665f" }}>avishek04.github.io</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "serif", fontSize: 82, letterSpacing: -3.5, lineHeight: 1 }}>Avishek Choudhury</div>
          <div style={{ fontFamily: "serif", fontStyle: "italic", fontSize: 68, letterSpacing: -2, lineHeight: 1.15, color: "#2458d3", marginTop: 14 }}>Software Engineer</div>
          <div style={{ marginTop: 35, fontSize: 24, color: "#61665f" }}>Backend · Full-stack · Distributed systems · Applied AI</div>
        </div>
        <div style={{ borderBottom: "1px solid rgba(21,23,20,.18)" }} />
      </div>
    ),
    size,
  );
}
