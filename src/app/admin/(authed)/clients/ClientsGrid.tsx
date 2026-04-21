"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Pencil, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClientLogoBadge } from "@/components/ui/ClientLogoBadge";
import { deleteClient } from "./actions";

type Row = {
  id: string;
  name: string;
  website: string | null;
  permissionStatus: string;
  visible: boolean;
  orderIdx: number;
};

const PERM_LABELS: Record<string, { label: string; color: string }> = {
  granted: { label: "Autorise", color: "rgb(34,197,94)" },
  pending: { label: "En attente", color: "rgb(234,140,56)" },
  declined: { label: "Refuse", color: "rgb(225,16,33)" },
  not_asked: { label: "Non demande", color: "rgb(130,130,130)" },
};

export function ClientsGrid({ rows }: { rows: Row[] }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rows.map((r) => <Card key={r.id} row={r} />)}
    </div>
  );
}

function Card({ row }: { row: Row }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();
  const perm = PERM_LABELS[row.permissionStatus] || PERM_LABELS.not_asked;

  return (
    <div className="relative rounded-xl p-5 flex flex-col" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <span className="pointer-events-none absolute left-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }} />
      <span className="pointer-events-none absolute right-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)" }} />

      <div className="flex items-center justify-center py-4">
        <ClientLogoBadge name={row.name} variant="stamped" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: perm.color }} />
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{perm.label}</span>
        </div>
        {row.website && (
          <a
            href={row.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            <ExternalLink className="h-3 w-3" /> Site
          </a>
        )}
      </div>

      <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          idx {row.orderIdx}
          {!row.visible && <span style={{ color: "var(--color-primary)" }}> • masque</span>}
        </span>
        <div className="flex items-center gap-1">
          <Link href={`/admin/clients/${row.id}`} className="rounded-md p-1.5 hover:bg-[var(--bg-muted)]" style={{ color: "var(--text-muted)" }} aria-label="Modifier">
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          {confirming ? (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await deleteClient(row.id);
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
