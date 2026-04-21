"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Loader2, Trash2, UserPlus, X, ChevronDown } from "lucide-react";
import { LEAD_STATUSES } from "./constants";
import { bulkAssign, bulkDelete, bulkUpdateStatus, exportLeadsCSV } from "./actions";
import type { Lead } from "@/db/schema";

interface UserOption {
  id: string;
  name: string;
  email: string;
}

interface Props {
  leads: Lead[];
  users: UserOption[];
}

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacte",
  in_progress: "En cours",
  quoted: "Devis envoye",
  won: "Gagne",
  lost: "Perdu",
};

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    new: { bg: "rgba(225,16,33,0.1)", fg: "var(--color-primary)" },
    contacted: { bg: "rgba(196,133,92,0.12)", fg: "var(--color-copper)" },
    in_progress: { bg: "rgba(196,133,92,0.1)", fg: "var(--color-copper)" },
    quoted: { bg: "rgba(59,130,180,0.12)", fg: "#3B82B4" },
    won: { bg: "rgba(60,170,140,0.15)", fg: "#3CAA8C" },
    lost: { bg: "var(--bg-muted)", fg: "var(--text-muted)" },
  };
  const c = colors[status] || colors.new;
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium"
      style={{ background: c.bg, color: c.fg }}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function LeadsTable({ leads, users }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);

  const allIds = useMemo(() => leads.map((l) => l.id), [leads]);
  const allSelected = selected.size > 0 && selected.size === allIds.length;
  const someSelected = selected.size > 0 && !allSelected;
  const ids = useMemo(() => Array.from(selected), [selected]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  }

  function clearSelection() {
    setSelected(new Set());
    setConfirming(false);
    setShowAssignMenu(false);
  }

  function doStatus(s: string) {
    start(async () => {
      const res = await bulkUpdateStatus(ids, s as (typeof LEAD_STATUSES)[number]);
      if (res.ok) {
        toast.success(`${res.count} lead${res.count > 1 ? "s" : ""} mis a jour`);
        clearSelection();
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function doAssign(uid: string | null) {
    start(async () => {
      const res = await bulkAssign(ids, uid);
      if (res.ok) {
        toast.success(`${res.count} lead${res.count > 1 ? "s" : ""} assigne${res.count > 1 ? "s" : ""}`);
        clearSelection();
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function doDelete() {
    start(async () => {
      const res = await bulkDelete(ids);
      if (res.ok) {
        toast.success(`${res.count} lead${res.count > 1 ? "s" : ""} supprime${res.count > 1 ? "s" : ""}`);
        clearSelection();
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function doExport() {
    start(async () => {
      const res = await exportLeadsCSV(ids);
      if (!res.ok) {
        toast.error(res.error || "Erreur");
        return;
      }
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `leads-${ts}-${ids.length}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Export de ${res.count} lead${res.count > 1 ? "s" : ""}`);
    });
  }

  return (
    <>
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  aria-label="Tout selectionner"
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Entreprise</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priorite</th>
              <th className="px-4 py-3 font-medium text-right">Recu</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const isSel = selected.has(l.id);
              return (
                <tr
                  key={l.id}
                  className="border-t transition-colors"
                  style={{ borderColor: "var(--border)", background: isSel ? "color-mix(in oklab, var(--color-primary) 6%, transparent)" : undefined }}
                >
                  <td className="w-10 px-3 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Selectionner ${l.firstName} ${l.lastName}`}
                      checked={isSel}
                      onChange={() => toggle(l.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                      style={{
                        background: l.type === "devis" ? "rgba(225,16,33,0.1)" : "rgba(196,133,92,0.1)",
                        color: l.type === "devis" ? "var(--color-primary)" : "var(--color-copper)",
                      }}
                    >
                      {l.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${l.id}`} className="block hover:text-primary transition-colors">
                      <div className="font-medium" style={{ color: "var(--text)" }}>
                        {l.firstName} {l.lastName}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{l.email}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{l.company || "—"}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    <div className="truncate max-w-[200px]">{l.service || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={l.status} />
                  </td>
                  <td className="px-4 py-3">
                    {l.priority === "high" && <span className="text-primary font-semibold">● Haute</span>}
                    {l.priority === "normal" && <span style={{ color: "var(--text-muted)" }}>—</span>}
                    {l.priority === "low" && <span style={{ color: "var(--text-muted)" }}>○ Basse</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-right" style={{ color: "var(--text-muted)" }}>
                    {new Date(l.receivedAt).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected.size > 0 && (
        <div
          className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 flex items-center gap-2 rounded-full px-3 py-2 shadow-2xl"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border-strong, var(--border))" }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono"
            style={{ background: "var(--color-primary)", color: "white" }}
          >
            {selected.size} selectionne{selected.size > 1 ? "s" : ""}
          </span>

          {/* Status dropdown */}
          <div className="relative">
            <details className="group">
              <summary
                className="cursor-pointer list-none inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
                style={{ background: "var(--bg-muted)", color: "var(--text)" }}
              >
                Statut <ChevronDown className="h-3 w-3" />
              </summary>
              <div
                className="absolute bottom-full left-0 mb-2 min-w-[160px] rounded-lg p-1 shadow-xl"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                {LEAD_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={pending}
                    onClick={() => doStatus(s)}
                    className="block w-full text-left rounded px-3 py-1.5 text-sm hover:bg-[var(--bg-muted)]"
                    style={{ color: "var(--text)" }}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </details>
          </div>

          {/* Assign dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAssignMenu((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
              style={{ background: "var(--bg-muted)", color: "var(--text)" }}
            >
              <UserPlus className="h-3 w-3" /> Assigner <ChevronDown className="h-3 w-3" />
            </button>
            {showAssignMenu && (
              <div
                className="absolute bottom-full left-0 mb-2 min-w-[180px] max-h-60 overflow-y-auto rounded-lg p-1 shadow-xl"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => { setShowAssignMenu(false); doAssign(null); }}
                  className="block w-full text-left rounded px-3 py-1.5 text-xs italic hover:bg-[var(--bg-muted)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Personne
                </button>
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    disabled={pending}
                    onClick={() => { setShowAssignMenu(false); doAssign(u.id); }}
                    className="block w-full text-left rounded px-3 py-1.5 text-sm hover:bg-[var(--bg-muted)]"
                    style={{ color: "var(--text)" }}
                  >
                    {u.name}
                    <span className="ml-2 font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>{u.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={pending}
            onClick={doExport}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
            style={{ background: "var(--bg-muted)", color: "var(--text)" }}
          >
            <Download className="h-3 w-3" /> Exporter CSV
          </button>

          {confirming ? (
            <>
              <span className="text-xs px-2" style={{ color: "var(--text)" }}>Sur ?</span>
              <button
                type="button"
                disabled={pending}
                onClick={doDelete}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                style={{ background: "var(--color-primary)" }}
              >
                {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full px-3 py-1.5 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Non
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={pending}
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
              style={{ background: "color-mix(in oklab, var(--color-primary) 12%, transparent)", color: "var(--color-primary)" }}
            >
              <Trash2 className="h-3 w-3" /> Supprimer
            </button>
          )}

          <button
            type="button"
            onClick={clearSelection}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="h-3 w-3" /> Annuler
          </button>
        </div>
      )}
    </>
  );
}
