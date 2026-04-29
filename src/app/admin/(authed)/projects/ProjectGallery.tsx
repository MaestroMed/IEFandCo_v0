"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  addProjectImage,
  updateProjectImage,
  deleteProjectImage,
  reorderProjectImages,
} from "./actions";

export type GalleryRow = {
  id: string;
  mediaId: string;
  caption: string | null;
  orderIdx: number;
  url: string | null;
  filename: string | null;
};

interface ProjectGalleryProps {
  projectId: string;
  rows: GalleryRow[];
}

export function ProjectGallery({ projectId, rows }: ProjectGalleryProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleAdd(mediaId: string | null) {
    if (!mediaId) return;
    start(async () => {
      const res = await addProjectImage(projectId, mediaId);
      if (res.ok) {
        toast.success("Image ajoutee");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function move(idx: number, delta: number) {
    const next = [...rows];
    const target = idx + delta;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    const orderedIds = next.map((r) => r.id);
    start(async () => {
      const res = await reorderProjectImages(projectId, orderedIds);
      if (res.ok) router.refresh();
      else toast.error(res.error || "Erreur");
    });
  }

  return (
    <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Galerie projet</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
          {rows.length} image{rows.length > 1 ? "s" : ""}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Aucune image. Ajoutez-en pour enrichir la fiche projet.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row, idx) => (
            <GalleryRowEditor
              key={row.id}
              row={row}
              projectId={projectId}
              isFirst={idx === 0}
              isLast={idx === rows.length - 1}
              onMoveUp={() => move(idx, -1)}
              onMoveDown={() => move(idx, +1)}
            />
          ))}
        </ul>
      )}

      <div className="pt-2">
        {pickerOpen ? (
          <div className="rounded-lg border p-3 space-y-2" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
            <p className="text-xs font-mono uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
              Choisir une image dans la mediatheque
            </p>
            <MediaPicker
              value={null}
              onChange={(id) => {
                if (id) {
                  handleAdd(id);
                  setPickerOpen(false);
                }
              }}
              mimeFilter="image/"
              triggerLabel="Choisir l'image a ajouter"
            />
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            <Plus className="h-4 w-4" /> Ajouter une image
          </button>
        )}
      </div>
    </section>
  );
}

function GalleryRowEditor({
  row,
  projectId,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: {
  row: GalleryRow;
  projectId: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [caption, setCaption] = useState(row.caption || "");
  const [mediaId, setMediaId] = useState(row.mediaId);
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  function save() {
    start(async () => {
      const res = await updateProjectImage(row.id, projectId, { caption, mediaId });
      if (res.ok) {
        toast.success("Enregistre");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function remove() {
    start(async () => {
      const res = await deleteProjectImage(row.id, projectId);
      if (res.ok) {
        toast.success("Supprime");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  return (
    <li
      className="rounded-lg p-3 grid grid-cols-[80px_1fr_auto] gap-3 items-start"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <div className="aspect-square rounded overflow-hidden" style={{ background: "var(--bg-muted)" }}>
        {row.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.url} alt={row.caption || row.filename || ""} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      <div className="space-y-2 min-w-0">
        <MediaPicker
          value={mediaId}
          onChange={(id) => setMediaId(id || mediaId)}
          mimeFilter="image/"
          triggerLabel="Changer l'image"
        />
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Legende (optionnel)"
          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            Enregistrer
          </button>
          <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
            idx: {row.orderIdx}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={pending || isFirst}
          onClick={onMoveUp}
          className="rounded p-1.5 disabled:opacity-30"
          style={{ color: "var(--text-muted)" }}
          aria-label="Monter"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={pending || isLast}
          onClick={onMoveDown}
          className="rounded p-1.5 disabled:opacity-30"
          style={{ color: "var(--text-muted)" }}
          aria-label="Descendre"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        {confirming ? (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              disabled={pending}
              onClick={remove}
              className="rounded-md px-2 py-1 text-[10px] text-white"
              style={{ background: "var(--color-primary)" }}
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              X
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded p-1.5"
            style={{ color: "var(--text-muted)" }}
            aria-label="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </li>
  );
}
