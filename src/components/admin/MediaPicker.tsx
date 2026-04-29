"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Upload, X, Trash2, Loader2, Search, Check, FileText } from "lucide-react";

type Tab = "library" | "upload";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mime: string;
  alt: string | null;
  bytes: number | null;
  width: number | null;
  height: number | null;
}

interface MediaPickerProps {
  value: string | null;
  onChange: (id: string | null) => void;
  /** Accepted MIME prefix(es). String : single prefix (e.g. "image/").
   *  Array : multiple prefixes (e.g. ["image/", "video/"]). */
  mimeFilter?: string | string[];
  triggerLabel?: string;
}

function asPrefixList(filter: string | string[] | undefined): string[] {
  if (!filter) return [];
  return Array.isArray(filter) ? filter : [filter];
}

function matchesAnyPrefix(mime: string, prefixes: string[]): boolean {
  if (prefixes.length === 0) return true;
  return prefixes.some((p) => mime.startsWith(p));
}

function humanBytes(b: number | null): string {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaPicker({ value, onChange, mimeFilter, triggerLabel }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("library");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [pendingSelection, setPendingSelection] = useState<string | null>(value);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hydrate the selected display name when value changes
  useEffect(() => {
    setPendingSelection(value);
    if (!value) {
      setSelected(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/admin/media/list?id=${encodeURIComponent(value)}`);
        if (!r.ok) return;
        const d = await r.json();
        if (!cancelled && d.items?.[0]) setSelected(d.items[0]);
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [value]);

  const prefixes = asPrefixList(mimeFilter);
  const prefixesKey = prefixes.join(",");

  const loadItems = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (prefixesKey) params.set("mime", prefixesKey);
      const r = await fetch(`/api/admin/media/list?${params.toString()}`);
      if (r.ok) {
        const d = await r.json();
        setItems(d.items || []);
      }
    } finally {
      setLoading(false);
    }
  }, [prefixesKey]);

  useEffect(() => {
    if (!open) return;
    loadItems("");
  }, [open, loadItems]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => loadItems(query), 200);
    return () => clearTimeout(t);
  }, [query, open, loadItems]);

  // Esc closes modal
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function uploadFile(file: File) {
    if (prefixes.length > 0 && !matchesAnyPrefix(file.type, prefixes)) {
      toast.error(`Type non supporté. Attendu : ${prefixes.join(", ")}*`);
      return null;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok || !d.ok) {
        toast.error(d.error || "Upload echoue");
        return null;
      }
      toast.success("Fichier televerse");
      // Append to list and select
      const newItem: MediaItem = {
        id: d.mediaId,
        filename: d.filename,
        url: d.url,
        mime: file.type,
        alt: null,
        bytes: file.size,
        width: null,
        height: null,
      };
      setItems((prev) => [newItem, ...prev]);
      setPendingSelection(d.mediaId);
      setTab("library");
      return d.mediaId as string;
    } finally {
      setUploading(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    for (const f of Array.from(files)) {
      await uploadFile(f);
    }
  }

  function commit() {
    onChange(pendingSelection);
    if (pendingSelection) {
      const found = items.find((it) => it.id === pendingSelection);
      if (found) setSelected(found);
    } else {
      setSelected(null);
    }
    setOpen(false);
  }

  function clearValue() {
    setPendingSelection(null);
  }

  return (
    <>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => { setPendingSelection(value); setOpen(true); }}
          className="flex items-center gap-3 rounded-lg w-full px-3 py-2 text-left transition-colors hover:bg-[var(--bg-muted)]"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          {selected ? (
            <>
              {selected.mime.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.url} alt={selected.alt || selected.filename} className="h-10 w-10 rounded object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded" style={{ background: "var(--bg-muted)" }}>
                  <FileText className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm" style={{ color: "var(--text)" }}>{selected.filename}</p>
                <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {selected.id.slice(0, 8)} · {humanBytes(selected.bytes)}
                </p>
              </div>
              <span className="text-xs" style={{ color: "var(--color-copper)" }}>Changer</span>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded" style={{ background: "var(--bg-muted)" }}>
                <ImageIcon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm" style={{ color: "var(--text)" }}>{triggerLabel || "Choisir un media"}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Bibliotheque ou nouvel upload</p>
              </div>
              <span className="text-xs" style={{ color: "var(--color-copper)" }}>Parcourir</span>
            </>
          )}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[85vh]"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-display text-base font-semibold" style={{ color: "var(--text)" }}>
                Selectionner un media
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-[var(--bg-muted)]"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
              {(["library", "upload"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className="px-5 py-2.5 text-sm border-b-2 transition-colors"
                  style={{
                    borderColor: tab === t ? "var(--color-primary)" : "transparent",
                    color: tab === t ? "var(--text)" : "var(--text-muted)",
                    fontWeight: tab === t ? 600 : 400,
                  }}
                >
                  {t === "library" ? "Bibliotheque" : "Televerser"}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {tab === "library" ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={mimeFilter ? `Rechercher dans ${mimeFilter}*...` : "Rechercher un fichier..."}
                      className="w-full rounded-lg pl-9 pr-3 py-2 text-sm"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                    />
                  </div>
                  {loading ? (
                    <div className="py-12 text-center">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" style={{ color: "var(--text-muted)" }} />
                    </div>
                  ) : items.length === 0 ? (
                    <div className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                      Aucun media. Utilisez l&apos;onglet &laquo; Televerser &raquo; pour en ajouter.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {items.map((it) => {
                        const isSel = pendingSelection === it.id;
                        const isImg = it.mime.startsWith("image/");
                        return (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => setPendingSelection(it.id)}
                            className="group relative rounded-lg overflow-hidden text-left transition-all"
                            style={{
                              background: "var(--bg-surface)",
                              border: isSel ? "2px solid var(--color-primary)" : "1px solid var(--border)",
                              outline: isSel ? "1px solid var(--color-primary)" : "none",
                            }}
                          >
                            <div className="aspect-square relative" style={{ background: "var(--bg-muted)" }}>
                              {isImg ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={it.url} alt={it.alt || it.filename} className="h-full w-full object-cover" />
                              ) : it.mime.startsWith("video/") ? (
                                <video
                                  src={it.url}
                                  className="h-full w-full object-cover"
                                  muted
                                  playsInline
                                  preload="metadata"
                                  aria-label={it.alt || it.filename}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <FileText className="h-6 w-6" style={{ color: "var(--text-muted)" }} />
                                </div>
                              )}
                              {isSel && (
                                <div
                                  className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full"
                                  style={{ background: "var(--color-primary)", color: "white" }}
                                >
                                  <Check className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                            <div className="p-1.5">
                              <p className="truncate text-[10px]" style={{ color: "var(--text)" }} title={it.filename}>{it.filename}</p>
                              <p className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>{humanBytes(it.bytes)}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="rounded-xl border-2 border-dashed p-8 text-center transition-colors"
                  style={{
                    borderColor: dragOver ? "var(--color-primary)" : "var(--border)",
                    background: dragOver ? "color-mix(in oklab, var(--color-primary) 8%, var(--card-bg))" : "var(--bg-muted)",
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                >
                  <Upload className="mx-auto mb-3 h-8 w-8" style={{ color: "var(--color-copper)" }} />
                  <p className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>
                    Glissez-deposez vos fichiers ici
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    {prefixes.length > 0
                      ? `Types acceptés : ${prefixes.map((p) => `${p}*`).join(", ")}`
                      : "Tous types acceptés"}
                  </p>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Upload..." : "Parcourir"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={prefixes.length > 0 ? prefixes.map((p) => `${p}*`).join(",") : undefined}
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
              )}
            </div>

            <div
              className="flex items-center justify-between border-t px-5 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                type="button"
                disabled={!pendingSelection}
                onClick={clearValue}
                className="inline-flex items-center gap-1.5 text-xs disabled:opacity-40"
                style={{ color: "var(--color-primary)" }}
              >
                <Trash2 className="h-3 w-3" /> Supprimer la selection
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={commit}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
