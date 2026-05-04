import type { Metadata } from "next";
// Next.js 15 experimental View Transitions
// @ts-expect-error — experimental API, types not yet exported
import { unstable_ViewTransition as ViewTransition } from "react";
import { clashDisplay, plusJakarta, jetbrainsMono } from "@/lib/fonts";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { PageProgress } from "@/components/layout/PageProgress";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Analytics } from "@/components/layout/Analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { generateLocalBusinessSchema } from "@/lib/seo";
import { getBranding } from "@/lib/content";
import { cn } from "@/lib/utils";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  // Resolve DB-overridable favicon. Falls back to Next.js conventions
  // (src/app/favicon.ico + public/icon.svg + public/apple-icon.svg) when
  // no admin-uploaded favicon is configured.
  const branding = await getBranding();

  const icons: Metadata["icons"] = branding.faviconUrl
    ? {
        icon: [
          { url: branding.faviconUrl },
          // Keep the static SVG as a fallback for browsers that prefer SVG
          { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: [{ url: branding.faviconUrl }],
        shortcut: branding.faviconUrl,
      }
    : undefined;

  return {
    metadataBase: new URL("https://iefandco.com"),
    title: {
      default:
        "IEF & CO | Métallerie Serrurerie Île-de-France — Groslay (95)",
      template: "%s | IEF & CO",
    },
    description:
      "IEF & CO, expert en métallerie et serrurerie à Groslay (95). Fermetures industrielles, portails, structures métalliques, menuiserie, portes coupe-feu, automatismes et maintenance 24/7 en Île-de-France.",
    keywords: [
      "métallerie",
      "serrurerie",
      "Groslay",
      "Val-d'Oise",
      "Île-de-France",
      "porte industrielle",
      "portail",
      "structure métallique",
      "coupe-feu",
      "maintenance",
    ],
    authors: [{ name: "IEF & CO" }],
    creator: "Numelite",
    icons,
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: "https://iefandco.com",
      siteName: "IEF & CO",
      title: "IEF & CO | Métallerie Serrurerie Île-de-France",
      description:
        "Concepteur et fabricant de solutions métalliques sur mesure. De la conception à la pose.",
    },
    twitter: {
      card: "summary_large_image",
      title: "IEF & CO | Métallerie Serrurerie Île-de-France",
      description:
        "Concepteur et fabricant de solutions métalliques sur mesure.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [localBusinessSchema, branding] = await Promise.all([
    generateLocalBusinessSchema(),
    getBranding(),
  ]);
  const navbarBranding = {
    logoUrl: branding.logoUrl,
    logoLightUrl: branding.logoLightUrl,
    logoAlt: branding.logoAlt,
  };

  return (
    <html
      lang="fr"
      className={cn(
        clashDisplay.variable,
        plusJakarta.variable,
        jetbrainsMono.variable
      )}
    >
      <head>
        {/* Theme FOUC prevention — runs before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.add(d?'dark':'light');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="antialiased">
        <SmoothScroll>
          <a href="#main-content" className="skip-to-content">
            Aller au contenu principal
          </a>
          <PageProgress />
          <ScrollProgress />
          <Navbar branding={navbarBranding} />
          <ViewTransition>
            <main id="main-content">{children}</main>
          </ViewTransition>
          <Footer />
          <StickyMobileCTA />
          <CookieBanner />
        </SmoothScroll>
        <Analytics />
        {/* Vercel Web Vitals (Core Web Vitals in real time) — no-op if NEXT_PUBLIC_VERCEL_ENV not set */}
        <SpeedInsights />
        {/* Vercel Analytics — pageviews + custom events. Respect cookie consent via Analytics layer above. */}
        <VercelAnalytics />
      </body>
    </html>
  );
}
