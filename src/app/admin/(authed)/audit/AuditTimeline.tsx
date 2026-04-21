"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { ACTION_COLORS, entityHref } from "./constants";

interface Entry {
  id: string;
  userId: string | null;
  actorName: string | null;
  actorEmail: string | null;
  entity: string;
  entityId: string | null;
  action: string;
  diffJson: string | null;
  at: number;
}

export function AuditTimeline({ entries }: { entries: Entry[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ol className="space-y-2 relative border-l pl-6 ml-4" style={{ borderColor: "var(--border)" }}>
      {entries.map((e) => {
        const open = openId === e.id;
        const colors = ACTION_COLORS[e.action] || { bg: "var(--bg-muted)", fg: "var(--text-muted)" };
        const href = entityHref(e.entity, e.entityId);

        return (
          <li key={e.id} className="relative">
            <span className="absolute -left-[27px] top-3 h-2 w-2 rounded-full" style={{ background: "var(--color-copper)" }} />
            <div className="rounded-xl p-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                      style={{ background: colors.bg, color: colors.fg }}
                    >
                      {e.action}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--color-copper)" }}>
                      {e.entity}
                    </span>
                    {e.entityId && (
                      href ? (
                        <Link
                          href={href}
                          className="inline-flex items-center gap-1 font-mono text-[11px] hover:text-primary"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {e.entityId.slice(0, 12)}…
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="font-mono text-[11px]" style={{ color: "var(--text-secondary)" }}>
                          {e.entityId.slice(0, 12)}…
                        </span>
                      )
                    )}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "var(--text)" }}>
                    {e.actorName || "Systeme"}
                    {e.actorEmail && (
                      <span className="ml-2 font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {e.actorEmail}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {new Date(e.at).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
                  </div>
                </div>
                {e.diffJson && (
                  <button
                    onClick={() => setOpenId(open ? null : e.id)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                    style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                  >
                    {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    Diff
                  </button>
                )}
              </div>
              {open && e.diffJson && <DiffPanel diffJson={e.diffJson} />}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function DiffPanel({ diffJson }: { diffJson: string }) {
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(diffJson);
  } catch {
    return (
      <pre
        className="mt-3 rounded-lg p-3 text-[11px] font-mono whitespace-pre-wrap"
        style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
      >
        {diffJson}
      </pre>
    );
  }

  // Detect shape: { changed: { key: [before, after] } }
  if (
    parsed &&
    typeof parsed === "object" &&
    "changed" in (parsed as Record<string, unknown>) &&
    typeof (parsed as { changed: unknown }).changed === "object"
  ) {
    const changed = (parsed as { changed: Record<string, [unknown, unknown]> }).changed;
    const keys = Object.keys(changed);
    if (keys.length === 0) {
      return <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>Aucun changement detecte.</p>;
    }
    return (
      <div className="mt-3 rounded-lg overflow-hidden" style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              <th className="px-3 py-2 font-medium">Champ</th>
              <th className="px-3 py-2 font-medium">Avant</th>
              <th className="px-3 py-2 font-medium">Apres</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => {
              const [before, after] = changed[k];
              return (
                <tr key={k} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-3 py-2 font-mono" style={{ color: "var(--color-copper)" }}>{k}</td>
                  <td className="px-3 py-2 font-mono align-top" style={{ color: "var(--text-muted)", textDecoration: "line-through" }}>
                    {formatVal(before)}
                  </td>
                  <td className="px-3 py-2 font-mono align-top" style={{ color: "var(--text)" }}>
                    {formatVal(after)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Fallback: pretty print
  return (
    <pre
      className="mt-3 rounded-lg p-3 text-[11px] font-mono whitespace-pre-wrap overflow-x-auto"
      style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
    >
      {JSON.stringify(parsed, null, 2)}
    </pre>
  );
}

function formatVal(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") return v.length > 80 ? v.slice(0, 80) + "…" : v;
  return JSON.stringify(v);
}
