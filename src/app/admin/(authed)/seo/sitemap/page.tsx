import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { ExternalLink, Map as MapIcon, Bot } from "lucide-react";
import { db, schema } from "@/db";
import { count, eq } from "drizzle-orm";
import { getSetting } from "@/lib/admin/settings";
import { STATIC_PAGES } from "../constants";
import { SitemapActions, RobotsEditor } from "./SitemapClient";

export const dynamic = "force-dynamic";

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://iefandco.com/sitemap.xml
`;

export default async function SitemapPage() {
  const [services, blogPublished, projectsPublished] = await Promise.all([
    db.select({ c: count() }).from(schema.services),
    db.select({ c: count() }).from(schema.blogPosts).where(eq(schema.blogPosts.status, "published")),
    db.select({ c: count() }).from(schema.projects).where(eq(schema.projects.status, "published")),
  ]);

  const totalPages =
    services[0].c + blogPublished[0].c + projectsPublished[0].c + STATIC_PAGES.length + 2; // +2 = mentions, politique

  const robotsCustom = await getSetting<string>("seo:robots-txt");
  const robotsContent = robotsCustom || DEFAULT_ROBOTS;

  return (
    <>
      <Topbar
        title="Sitemap & Robots"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "SEO", href: "/admin/seo" },
          { label: "Sitemap" },
        ]}
      />

      <div className="p-8 space-y-8">
        <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--bg-muted)" }}>
                  <MapIcon className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
                </div>
                <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
                  Sitemap auto-genere
                </h2>
              </div>
              <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                {totalPages} URL incluses (services + blog + projets publies + pages statiques).
                Le sitemap est genere a la demande par Next.js.
              </p>
            </div>
            <SitemapActions />
          </div>

          <div className="rounded-lg p-4" style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs" style={{ color: "var(--text)" }}>
                /sitemap.xml
              </div>
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs hover:text-primary"
                style={{ color: "var(--color-copper)" }}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Voir le sitemap
              </Link>
            </div>
          </div>

          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            Derniere generation : a la demande (regeneration automatique a chaque requete).
          </p>
        </section>

        <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--bg-muted)" }}>
              <Bot className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
            </div>
            <div>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
                robots.txt
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Le contenu personnalise est stocke dans <code className="font-mono">settings:seo:robots-txt</code>.
                Vide = defaut Next.js.
              </p>
            </div>
          </div>

          <RobotsEditor initial={robotsContent} isCustom={!!robotsCustom} />
        </section>
      </div>
    </>
  );
}
