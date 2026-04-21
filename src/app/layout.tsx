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
import { generateLocalBusinessSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://iefandco.com"),
  title: {
    default:
      "IEF & CO | Metallerie Serrurerie Ile-de-France — Groslay (95)",
    template: "%s | IEF & CO — Metallerie Serrurerie",
  },
  description:
    "IEF & CO, expert en metallerie et serrurerie a Groslay (95). Fermetures industrielles, portails, structures metalliques, menuiserie, portes coupe-feu, automatismes et maintenance 24/7 en Ile-de-France.",
  keywords: [
    "metallerie",
    "serrurerie",
    "Groslay",
    "Val-d'Oise",
    "Ile-de-France",
    "porte industrielle",
    "portail",
    "structure metallique",
    "coupe-feu",
    "maintenance",
  ],
  authors: [{ name: "IEF & CO" }],
  creator: "Numelite",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://iefandco.com",
    siteName: "IEF & CO",
    title: "IEF & CO | Metallerie Serrurerie Ile-de-France",
    description:
      "Concepteur et fabricant de solutions metalliques sur mesure. De la conception a la pose.",
  },
  twitter: {
    card: "summary_large_image",
    title: "IEF & CO | Metallerie Serrurerie Ile-de-France",
    description:
      "Concepteur et fabricant de solutions metalliques sur mesure.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = generateLocalBusinessSchema();

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
          <Navbar />
          <ViewTransition>
            <main id="main-content">{children}</main>
          </ViewTransition>
          <Footer />
          <StickyMobileCTA />
        </SmoothScroll>
      </body>
    </html>
  );
}
