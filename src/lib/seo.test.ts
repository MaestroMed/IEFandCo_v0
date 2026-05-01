import { describe, it, expect } from "vitest";
import { generatePageMetadata } from "./seo";

describe("generatePageMetadata", () => {
  it("produces a correct canonical URL based on site root + path", () => {
    const md = generatePageMetadata({
      title: "Page test",
      description: "A description",
      path: "/services",
    });
    expect(md.alternates).toEqual({ canonical: "https://iefandco.com/services" });
  });

  it("emits matching title + description in OG/Twitter blocks", () => {
    const md = generatePageMetadata({
      title: "Devis gratuit",
      description: "Demandez un devis sous 48h",
      path: "/devis",
    });
    expect(md.title).toBe("Devis gratuit");
    expect(md.description).toBe("Demandez un devis sous 48h");
    expect(md.openGraph?.title).toBe("Devis gratuit");
    expect(md.openGraph?.description).toBe("Demandez un devis sous 48h");
    expect(md.openGraph?.url).toBe("https://iefandco.com/devis");
    expect(md.openGraph?.siteName).toBe("IEF & CO");
    expect(md.openGraph?.locale).toBe("fr_FR");
    const twitter = md.twitter as { card?: string } | null | undefined;
    expect(twitter?.card).toBe("summary_large_image");
  });

  it("omits OG/Twitter image arrays when no image override is given (fallback to convention)", () => {
    const md = generatePageMetadata({
      title: "T",
      description: "D",
      path: "/",
    });
    expect(md.openGraph && "images" in md.openGraph ? md.openGraph.images : undefined).toBeUndefined();
    expect(md.twitter && "images" in md.twitter ? md.twitter.images : undefined).toBeUndefined();
  });

  it("includes OG/Twitter images when image override is provided", () => {
    const md = generatePageMetadata({
      title: "T",
      description: "D",
      path: "/contact",
      image: "https://cdn.example.com/og/contact.jpg",
    });
    const ogImages = md.openGraph && "images" in md.openGraph ? md.openGraph.images : undefined;
    expect(Array.isArray(ogImages)).toBe(true);
    if (Array.isArray(ogImages) && typeof ogImages[0] === "object" && ogImages[0] !== null) {
      expect((ogImages[0] as { url: string }).url).toBe("https://cdn.example.com/og/contact.jpg");
      expect((ogImages[0] as { width: number }).width).toBe(1200);
      expect((ogImages[0] as { height: number }).height).toBe(630);
    }
    const twitterImages = md.twitter && "images" in md.twitter ? md.twitter.images : undefined;
    expect(twitterImages).toEqual(["https://cdn.example.com/og/contact.jpg"]);
  });
});
