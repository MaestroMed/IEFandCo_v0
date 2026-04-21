import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { ExternalLink, LayoutGrid, Pencil } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getMetaMatrix } from "../queries";
import { TITLE_MIN, TITLE_MAX, DESC_MIN, DESC_MAX } from "../constants";

export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  service: "Service",
  blog: "Blog",
  project: "Projet",
  static: "Statique",
};

const SOURCE_COLORS: Record<string, string> = {
  service: "var(--color-copper)",
  blog: "#3B82B4",
  project: "#3CAA8C",
  static: "var(--text-muted)",
};

export default async function MetaMatrixPage() {
  const rows = await getMetaMatrix();

  return (
    <>
      <Topbar
        title="Meta matrix"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "SEO", href: "/admin/seo" },
          { label: "Meta" },
        ]}
      />

      <div className="p-8 space-y-6">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {rows.length} page{rows.length > 1 ? "s" : ""} indexable{rows.length > 1 ? "s" : ""}. Les couleurs signalent les longueurs hors recommandations Google.
        </p>

        {rows.length === 0 ? (
          <EmptyState icon={LayoutGrid} title="Aucune page" description="Aucune page n'a encore ete creee." />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                  <th className="px-4 py-3 font-medium">Page</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium text-right">Longueur</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const titleLen = (r.title || "").length;
                  const descLen = (r.description || "").length;
                  const titleColor = lengthColor(titleLen, TITLE_MIN, TITLE_MAX);
                  const descColor = lengthColor(descLen, DESC_MIN, DESC_MAX);
                  return (
                    <tr key={`${r.source}-${r.id}`} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                            style={{ background: "var(--bg-muted)", color: SOURCE_COLORS[r.source] }}
                          >
                            {SOURCE_LABELS[r.source]}
                          </span>
                          <span className="font-medium" style={{ color: "var(--text)" }}>{r.name}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {r.path}
                          <a
                            href={r.path}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 hover:text-primary"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top max-w-[260px]" style={{ color: r.title ? "var(--text)" : "var(--text-muted)" }}>
                        <span className="block truncate">{r.title || <em>—</em>}</span>
                      </td>
                      <td className="px-4 py-3 align-top max-w-[320px]" style={{ color: r.description ? "var(--text-secondary)" : "var(--text-muted)" }}>
                        <span className="block truncate">{r.description || <em>—</em>}</span>
                      </td>
                      <td className="px-4 py-3 align-top text-right font-mono text-[11px]">
                        <div style={{ color: titleColor }}>{titleLen}/{TITLE_MAX} t</div>
                        <div style={{ color: descColor }}>{descLen}/{DESC_MAX} d</div>
                      </td>
                      <td className="px-4 py-3 align-top text-right">
                        <Link
                          href={r.editHref}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs"
                          style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                        >
                          <Pencil className="h-3 w-3" />
                          Editer
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function lengthColor(len: number, min: number, max: number): string {
  if (len === 0) return "var(--text-muted)";
  if (len < min || len > max) return "var(--color-primary)";
  return "#3CAA8C";
}
