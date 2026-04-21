"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteTeamMember } from "./actions";

type Row = { id: string; name: string; role: string; expertise: string; initials: string; visible: boolean; orderIdx: number };

export function TeamCards({ rows }: { rows: Row[] }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((r) => <Card key={r.id} row={r} />)}
    </div>
  );
}

function Card({ row }: { row: Row }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <div className="relative rounded-xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      {/* Corner brackets */}
      <span className="pointer-events-none absolute left-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }} />
      <span className="pointer-events-none absolute right-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)" }} />

      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full font-mono text-lg font-bold" style={{ background: "var(--color-copper)", color: "white" }}>
          {row.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold truncate" style={{ color: "var(--text)" }}>{row.name}</div>
          <div className="text-sm truncate" style={{ color: "var(--text-muted)" }}>{row.role}</div>
        </div>
      </div>

      <p className="mt-3 text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>{row.expertise}</p>

      <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          <span>idx {row.orderIdx}</span>
          {!row.visible && <span style={{ color: "var(--color-primary)" }}>• masque</span>}
        </div>
        <div className="flex items-center gap-1">
          <Link href={`/admin/team/${row.id}`} className="rounded-md p-1.5 hover:bg-[var(--bg-muted)]" style={{ color: "var(--text-muted)" }} aria-label="Modifier">
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          {confirming ? (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await deleteTeamMember(row.id);
                  if (res.ok) {
                    toast.success("Supprime");
                    router.refresh();
                  } else {
                    toast.error(res.error || "Erreur");
                  }
                })
              }
              className="rounded-md px-2 py-1 text-[10px] text-white"
              style={{ background: "var(--color-primary)" }}
            >
              Confirmer
            </button>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="rounded-md p-1.5 hover:bg-[var(--bg-muted)]" style={{ color: "var(--text-muted)" }} aria-label="Supprimer">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
