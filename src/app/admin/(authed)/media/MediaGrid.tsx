"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Copy, FileText as FileIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadMedia, deleteMedia } from "./actions";

type Row = {
  id: string;
  filename: string;
  url: string;
  mime: string;
  width: number | null;
  height: number | null;
  bytes: number | null;
  alt: string | null;
};

function humanBytes(b: number | null): string {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGrid({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", f);
        const res = await uploadMedia(fd);
        if (!res.ok) {
          toast.error(`${f.name}: ${res.error}`);
        }
      }
      toast.success("Upload termine");
      router.refresh();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {rows.length} fichier{rows.length > 1 ? "s" : ""}
        </p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Upload..." : "Televerser"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />
      </div>

      {rows.length === 0 ? (
        <div className="relative rounded-xl p-12 text-center" style={{ background: "var(--card-bg)", border: "1px dashed var(--border)" }}>
          <Upload className="mx-auto h-8 w-8 mb-3" style={{ color: "var(--color-copper)" }} />
          <p className="font-display text-base font-semibold" style={{ color: "var(--text)" }}>Mediatheque vide</p>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Commencez par televerser vos premieres images.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {rows.map((r) => {
            const isImage = r.mime.startsWith("image/");
            return (
              <div
                key={r.id}
                className="group relative rounded-xl overflow-hidden flex flex-col"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <div className="aspect-[4/3] relative overflow-hidden" style={{ background: "var(--bg-muted)" }}>
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.url} alt={r.alt || r.filename} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <FileIcon className="h-8 w-8" style={{ color: "var(--text-muted)" }} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(r.id);
                        toast.success("ID copie");
                      }}
                      className="rounded-md p-1.5 backdrop-blur"
                      style={{ background: "rgba(0,0,0,0.5)", color: "white" }}
                      aria-label="Copier ID"
                      title="Copier l'ID"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {isImage && (
                    <span className="absolute left-2 top-2 font-mono text-[9px] uppercase tracking-wider rounded px-1.5 py-0.5" style={{ background: "rgba(0,0,0,0.5)", color: "white" }}>
                      <ImageIcon className="inline h-2.5 w-2.5 mr-1" />
                      IMG
                    </span>
                  )}
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-xs font-mono truncate" style={{ color: "var(--text)" }} title={r.filename}>{r.filename}</p>
                  <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
                    <span>{humanBytes(r.bytes)}</span>
                    {r.width && r.height && <span>{r.width}x{r.height}</span>}
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wider truncate" style={{ color: "var(--text-muted)" }}>
                      {r.id.slice(0, 8)}
                    </span>
                    {confirmingId === r.id ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          start(async () => {
                            const res = await deleteMedia(r.id);
                            if (res.ok) {
                              toast.success("Supprime");
                              setConfirmingId(null);
                              router.refresh();
                            } else {
                              toast.error(res.error || "Erreur");
                            }
                          })
                        }
                        className="rounded-md px-2 py-1 text-[9px] text-white"
                        style={{ background: "var(--color-primary)" }}
                      >
                        Confirmer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingId(r.id)}
                        className="rounded-md p-1 hover:bg-[var(--bg-muted)]"
                        style={{ color: "var(--text-muted)" }}
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
