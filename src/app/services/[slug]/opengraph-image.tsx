import { ImageResponse } from "next/og";
import { getServiceBySlug } from "@/lib/content";

export const alt = "IEF & CO — Service métallerie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  const title = service?.title ?? "IEF & CO";
  const subtitle =
    service?.shortDescription ??
    "Bureau d'étude — Atelier — Pose. Métallerie & serrurerie en Île-de-France.";
  const accent = service?.accentColor ?? "196, 133, 92";
  const photoBg =
    service?.coverUrl &&
    !service.coverMime?.startsWith("video/") &&
    service.coverUrl.startsWith("http")
      ? service.coverUrl
      : null;

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
        {photoBg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoBg}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "flex",
            }}
          />
        )}
        {photoBg && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(5,5,8,0.92) 0%, rgba(5,5,8,0.55) 50%, rgba(5,5,8,0.85) 100%)",
              display: "flex",
            }}
          />
        )}
        {/* Living gradient — service accent top-right (only when no photo) */}
        {!photoBg && (
          <div
            style={{
              position: "absolute",
              top: -200,
              right: -200,
              width: 900,
              height: 900,
              background: `radial-gradient(circle, rgba(${accent}, 0.32) 0%, transparent 60%)`,
              display: "flex",
            }}
          />
        )}
        {/* Living gradient — red bottom-left (only when no photo) */}
        {!photoBg && (
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
        )}

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
          <span>Service — Métallerie sur mesure</span>
        </div>

        {/* Main title + subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 60,
            gap: 28,
            maxWidth: 1040,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1.04,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#9A9A93",
              lineHeight: 1.35,
              fontWeight: 400,
            }}
          >
            {subtitle.length > 180 ? subtitle.slice(0, 178) + "…" : subtitle}
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
