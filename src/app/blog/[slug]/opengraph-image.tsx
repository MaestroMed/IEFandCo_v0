import { ImageResponse } from "next/og";
import { getBlogPost } from "@/data/blog";

export const alt = "IEF & CO — Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tint by editorial category — matches the blog's color system
const CATEGORY_ACCENT: Record<string, string> = {
  Guide: "196, 133, 92", // copper (default brand)
  Normes: "200, 120, 50", // amber/fire
  Technique: "59, 130, 180", // steel blue
  "Case Study": "60, 170, 140", // teal/reliable
};

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  const title = post?.title ?? "IEF & CO";
  const subtitle = post
    ? `${post.category} · ${post.readingMinutes} min de lecture`
    : "Insights métallerie & serrurerie — IEF & CO";
  const accent = (post && CATEGORY_ACCENT[post.category]) || "196, 133, 92";

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
        {/* Living gradient — category accent top-right */}
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
          <span>Journal — Insights métallerie</span>
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
              fontSize: 70,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#9A9A93",
              lineHeight: 1.35,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {subtitle}
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
