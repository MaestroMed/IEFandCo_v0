"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { MoreHorizontal, Copy, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { deleteProject, duplicateProject } from "./actions";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  title: string;
  slug: string;
  category: string;
  clientName: string | null;
  year: number | null;
  status: string;
  updatedAt: Date;
  coverUrl: string | null;
};

export function ProjectsTable({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function toggle(id: string) {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())}
                checked={selected.size > 0 && selected.size === rows.length}
              />
            </th>
            <th className="px-4 py-3 w-16 font-medium">Cover</th>
            <th className="px-4 py-3 font-medium">Titre</th>
            <th className="px-4 py-3 font-medium">Categorie</th>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Annee</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Maj</th>
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
              <td className="px-4 py-3">
                <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
              </td>
              <td className="px-4 py-3">
                <div className="h-10 w-14 rounded overflow-hidden" style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
                  {r.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.coverUrl} alt={r.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3" style={{ color: "var(--text)" }}>
                <Link href={`/admin/projects/${r.id}`} className="hover:text-primary transition-colors font-medium">
                  {r.title}
                </Link>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>/{r.slug}</div>
              </td>
              <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {r.category}
              </td>
              <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                {r.clientName || "—"}
              </td>
              <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {r.year || "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(r.updatedAt).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-4 py-3 text-right relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === r.id ? null : r.id);
                    setConfirmingId(null);
                  }}
                  className="rounded-md p-1.5 hover:bg-[var(--bg-surface)]"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {openMenu === r.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => {
                        setOpenMenu(null);
                        setConfirmingId(null);
                      }}
                    />
                    <div
                      className="absolute right-4 top-10 z-20 w-48 rounded-lg py-1 shadow-lg"
                      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
                    >
                      <Link
                        href={`/admin/projects/${r.id}`}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--bg-muted)]"
                        style={{ color: "var(--text)" }}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Modifier
                      </Link>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--bg-muted)]"
                        style={{ color: "var(--text)" }}
                        onClick={() => {
                          setOpenMenu(null);
                          start(async () => {
                            const res = await duplicateProject(r.id);
                            if (res.ok) {
                              toast.success("Duplique");
                              router.refresh();
                            } else {
                              toast.error(res.error || "Erreur");
                            }
                          });
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" /> Dupliquer
                      </button>
                      {confirmingId === r.id ? (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white"
                          style={{ background: "var(--color-primary)" }}
                          disabled={pending}
                          onClick={() =>
                            start(async () => {
                              const res = await deleteProject(r.id);
                              if (res.ok) {
                                toast.success("Supprime");
                                setOpenMenu(null);
                                setConfirmingId(null);
                                router.refresh();
                              } else {
                                toast.error(res.error || "Erreur");
                              }
                            })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Confirmer
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--bg-muted)]"
                          style={{ color: "var(--text)" }}
                          onClick={() => setConfirmingId(r.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Supprimer
                        </button>
                      )}
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
