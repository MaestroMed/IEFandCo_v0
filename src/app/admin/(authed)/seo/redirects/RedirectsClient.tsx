"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { createRedirect, deleteRedirect, importRedirectsCsv, updateRedirect } from "./actions";
import { REDIRECT_STATUS_CODES } from "../constants";

interface RedirectRow {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  hits: number;
  createdAt: number;
}

interface Props {
  redirects: RedirectRow[];
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function RedirectsClient({ redirects }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [form, setForm] = useState({ fromPath: "", toPath: "", statusCode: 301 });
  const [csv, setCsv] = useState("");

  function resetForm() {
    setForm({ fromPath: "", toPath: "", statusCode: 301 });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(r: RedirectRow) {
    setEditingId(r.id);
    setForm({ fromPath: r.fromPath, toPath: r.toPath, statusCode: r.statusCode });
    setShowForm(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fromPath.trim() || !form.toPath.trim()) {
      toast.error("From et to requis");
      return;
    }
    start(async () => {
      const res = editingId
        ? await updateRedirect(editingId, form)
        : await createRedirect(form);
      if (res.ok) {
        toast.success(editingId ? "Redirection mise a jour" : "Redirection creee");
        resetForm();
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function onDelete(id: string) {
    start(async () => {
      const res = await deleteRedirect(id);
      if (res.ok) {
        toast.success("Redirection supprimee");
        setConfirmDelete(null);
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function onImport() {
    if (!csv.trim()) {
      toast.error("CSV vide");
      return;
    }
    start(async () => {
      const res = await importRedirectsCsv(csv);
      if (res.ok) {
        toast.success(`${res.imported} importee(s), ${res.skipped} ignoree(s)`);
        setCsv("");
        setShowImport(false);
        router.refresh();
      } else {
        toast.error(res.error || "Erreur d'import");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {redirects.length} redirection{redirects.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowImport((s) => !s); setShowForm(false); }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <Upload className="h-3.5 w-3.5" /> Import CSV
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); setShowImport(false); }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Nouvelle redirection
          </button>
        </div>
      </div>

      {showImport && (
        <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div>
            <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Import CSV</h3>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Format: <code className="font-mono">/from,/to,code</code> (un par ligne, code optionnel par defaut 301).
              Lignes commencant par <code className="font-mono">#</code> ignorees.
            </p>
          </div>
          <textarea
            rows={8}
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder="/ancien-chemin,/nouveau-chemin,301&#10;/blog/old,/blog/new"
            className={`${inputCls} font-mono text-xs`}
            style={inputStyle}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setShowImport(false); setCsv(""); }}
              className="rounded-lg border px-4 py-2 text-sm"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onImport}
              disabled={pending}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Importer
            </button>
          </div>
        </section>
      )}

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="rounded-xl p-6 space-y-4"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
            {editingId ? "Modifier" : "Nouvelle"} redirection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>From path</label>
              <input
                value={form.fromPath}
                onChange={(e) => setForm((f) => ({ ...f, fromPath: e.target.value }))}
                className={`${inputCls} font-mono`}
                style={inputStyle}
                placeholder="/ancien-chemin"
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>To path</label>
              <input
                value={form.toPath}
                onChange={(e) => setForm((f) => ({ ...f, toPath: e.target.value }))}
                className={`${inputCls} font-mono`}
                style={inputStyle}
                placeholder="/nouveau-chemin"
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Status code</label>
              <select
                value={form.statusCode}
                onChange={(e) => setForm((f) => ({ ...f, statusCode: Number(e.target.value) }))}
                className={inputCls}
                style={inputStyle}
              >
                {REDIRECT_STATUS_CODES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              {pending && <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</span>}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-4 py-2 text-sm"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {editingId ? "Enregistrer" : "Creer"}
              </button>
            </div>
          </div>
        </form>
      )}

      {redirects.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">To</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium text-right">Hits</th>
                <th className="px-4 py-3 font-medium">Cree</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {redirects.map((r) => (
                <tr key={r.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text)" }}>{r.fromPath}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>{r.toPath}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-copper)" }}>{r.statusCode}</td>
                  <td className="px-4 py-3 font-mono text-xs text-right" style={{ color: "var(--text-muted)" }}>{r.hits}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {confirmDelete === r.id ? (
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => onDelete(r.id)}
                          disabled={pending}
                          className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-50"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="rounded-md px-2 py-1 text-[11px]"
                          style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => startEdit(r)}
                          className="text-xs hover:text-primary"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Editer
                        </button>
                        <button
                          onClick={() => setConfirmDelete(r.id)}
                          className="inline-flex items-center text-xs hover:text-primary"
                          style={{ color: "var(--text-secondary)" }}
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
