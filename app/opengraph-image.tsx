import { ImageResponse } from "next/og";

export const alt = "SenangPlanner — Wedding & Event Management";
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
          padding: "64px",
          background: "#f7f6f2",
          color: "#151515",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4 }}>WEDDING & EVENT MANAGEMENT</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 100,
            lineHeight: 1.05,
            maxWidth: 950,
          }}
        >
          Kami uruskan stress,
          <br />
          anda nikmati majlis.
        </div>
        <div style={{ fontSize: 28, color: "#b8923a" }}>SENANGPLANNER · MALAYSIA</div>
      </div>
    ),
    size,
  );
}
