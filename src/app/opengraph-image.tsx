import { ImageResponse } from "next/og";

export const alt = "IEF & CO — Métallerie Serrurerie Île-de-France";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#050508",
          position: "relative",
          padding: 80,
          color: "#F5F5F2",
          fontFamily: "sans-serif",
        }}
      >
        {/* Living gradient — copper top-right */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 900,
            height: 900,
            background: "radial-gradient(circle, rgba(196, 133, 92, 0.30) 0%, transparent 60%)",
            display: "flex",
          }}
        />
        {/* Living gradient — red bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -300,
            left: -100,
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(225, 16, 33, 0.18) 0%, transparent 60%)",
            display: "flex",
          }}
        />
        {/* Living gradient — amber center bottom */}
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: 350,
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(232, 121, 43, 0.14) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Top accent rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 200,
            right: 200,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(196, 133, 92, 0.6), transparent)",
            display: "flex",
          }}
        />

        {/* Top label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 18,
            textTransform: "uppercase",
            letterSpacing: 8,
            color: "#C4855C",
            fontWeight: 500,
          }}
        >
          <div style={{ width: 50, height: 1, background: "#C4855C", display: "flex" }} />
          <span>Bureau d&apos;étude — Atelier — Pose</span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 70,
            lineHeight: 0.94,
            fontSize: 130,
            fontWeight: 900,
            letterSpacing: -5,
          }}
        >
          <div style={{ display: "flex" }}>L&apos;art du métal,</div>
          <div
            style={{
              display: "flex",
              background: "linear-gradient(135deg, #888 0%, #F5F5F2 40%, #999 60%, #F5F5F2 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            entre force
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ color: "#7A7A75" }}>&&nbsp;</span>
            <span style={{ color: "#E11021" }}>précision</span>
          </div>
        </div>

        {/* Bottom strip: brand + EN 1090 */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            IEF
            <span style={{ color: "#E11021", margin: "0 6px" }}>&</span>
            CO
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 16,
                color: "#C4855C",
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              <span>EN 1090 · Eurocode 3</span>
              <div style={{ width: 50, height: 1, background: "#C4855C", display: "flex" }} />
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#7A7A75",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Île-de-France · Groslay 95
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
