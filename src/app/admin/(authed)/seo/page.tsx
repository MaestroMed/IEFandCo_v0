import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  AlertTriangle,
  Repeat,
  Code2,
  LayoutGrid,
  Map as MapIcon,
  Tag,
  Search,
} from "lucide-react";
import { getSeoOverview } from "./queries";

export const dynamic = "force-dynamic";

export default async function SeoIndexPage() {
  const data = await getSeoOverview();

  return (
    <>
      <Topbar title="SEO" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "SEO" }]} />

      <div className="p-8 space-y-8">
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
            Sante du referencement
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard label="Pages totales" value={data.totalPages} sub="Services + blog + projets + statiques" icon={FileText} />
            <KPICard
              label="Meta description manquante"
              value={data.missingDesc}
              sub={data.missingDesc === 0 ? "Aucune page incomplete" : "Pages a completer"}
              icon={AlertTriangle}
              accent={data.missingDesc > 0}
            />
            <KPICard label="Redirections actives" value={data.redirectsCount} sub="301 / 302 / 307 / 308" icon={Repeat} href="/admin/seo/redirects" />
            <KPICard label="Schema.org actifs" value={data.schemaCount} sub="Homepage, services, blog" icon={Code2} href="/admin/seo/schema" />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
            Outils
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Tile
              href="/admin/seo/meta"
              icon={LayoutGrid}
              title="Meta matrix"
              desc="Voir et editer titres + descriptions de toutes les pages."
            />
            <Tile
              href="/admin/seo/redirects"
              icon={Repeat}
              title="Redirections"
              desc="Gerer les redirections 301/302/307/308 et import CSV."
            />
            <Tile
              href="/admin/seo/sitemap"
              icon={MapIcon}
              title="Sitemap & Robots"
              desc="Voir le sitemap auto-genere et editer robots.txt."
            />
            <Tile
              href="/admin/seo/schema"
              icon={Tag}
              title="Schema.org"
              desc="Apercu des donnees structurees actives sur le site."
            />
          </div>
        </section>
      </div>
    </>
  );
}

function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: typeof Search;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <div
      className="rounded-xl p-5 transition-all hover:-translate-y-0.5 h-full"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
    >
      <div className="flex items-start justify-between">
        <Icon className="h-5 w-5" style={{ color: accent ? "var(--color-primary)" : "var(--color-copper)" }} />
        {href && <ArrowRight className="h-4 w-4 opacity-30" />}
      </div>
      <div className="mt-6">
        <div className="font-mono text-3xl font-bold" style={{ color: "var(--text)" }}>{value}</div>
        <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{label}</div>
        {sub && <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{sub}</div>}
      </div>
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

function Tile({ href, icon: Icon, title, desc }: { href: string; icon: typeof Search; title: string; desc: string }) {
  return (
    <Link href={href} className="block">
      <div
        className="relative h-full rounded-xl p-5 transition-all hover:-translate-y-0.5"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <span className="pointer-events-none absolute left-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--color-copper)", borderLeft: "1px solid var(--color-copper)" }} />
        <span className="pointer-events-none absolute right-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--color-copper)", borderRight: "1px solid var(--color-copper)" }} />
        <span className="pointer-events-none absolute bottom-2 left-2 h-2 w-2" style={{ borderBottom: "1px solid var(--color-copper)", borderLeft: "1px solid var(--color-copper)" }} />
        <span className="pointer-events-none absolute bottom-2 right-2 h-2 w-2" style={{ borderBottom: "1px solid var(--color-copper)", borderRight: "1px solid var(--color-copper)" }} />
        <Icon className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
        <h3 className="mt-3 font-display text-base font-semibold" style={{ color: "var(--text)" }}>{title}</h3>
        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
      </div>
    </Link>
  );
}
