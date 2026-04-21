"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { updateNavigation } from "../actions";

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface Props {
  initial: NavItem[];
  seeded: boolean; // true if loaded from defaults (not yet stored)
}

const labelCls = "block text-[10px] font-mono uppercase tracking-[0.15em] mb-1";
const inputCls = "w-full rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function NavigationEditor({ initial, seeded }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [items, setItems] = useState<NavItem[]>(initial);

  function addItem() {
    setItems((arr) => [...arr, { label: "Nouveau lien", href: "/" }]);
  }

  function removeItem(idx: number) {
    setItems((arr) => arr.filter((_, i) => i !== idx));
  }

  function moveItem(idx: number, dir: -1 | 1) {
    setItems((arr) => {
      const next = [...arr];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return next;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function updateItem(idx: number, patch: Partial<NavItem>) {
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function addChild(parentIdx: number) {
    setItems((arr) =>
      arr.map((it, i) => {
        if (i !== parentIdx) return it;
        return { ...it, children: [...(it.children || []), { label: "Nouvel enfant", href: "/" }] };
      }),
    );
  }

  function updateChild(parentIdx: number, childIdx: number, patch: Partial<NavItem>) {
    setItems((arr) =>
      arr.map((it, i) => {
        if (i !== parentIdx) return it;
        const children = (it.children || []).map((c, j) => (j === childIdx ? { ...c, ...patch } : c));
        return { ...it, children };
      }),
    );
  }

  function removeChild(parentIdx: number, childIdx: number) {
    setItems((arr) =>
      arr.map((it, i) => {
        if (i !== parentIdx) return it;
        const children = (it.children || []).filter((_, j) => j !== childIdx);
        return { ...it, children: children.length > 0 ? children : undefined };
      }),
    );
  }

  function moveChild(parentIdx: number, childIdx: number, dir: -1 | 1) {
    setItems((arr) =>
      arr.map((it, i) => {
        if (i !== parentIdx) return it;
        const children = [...(it.children || [])];
        const target = childIdx + dir;
        if (target < 0 || target >= children.length) return it;
        [children[childIdx], children[target]] = [children[target], children[childIdx]];
        return { ...it, children };
      }),
    );
  }

  function onSubmit() {
    start(async () => {
      const res = await updateNavigation(items);
      if (res.ok) {
        toast.success("Navigation enregistree");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {seeded && (
            <p className="text-xs" style={{ color: "var(--color-copper)" }}>
              Aucune navigation personnalisee enregistree — affichage des valeurs par defaut. Cliquez sur Enregistrer pour les sauvegarder.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {pending && <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</span>}
          </span>
          <button
            type="button"
            onClick={onSubmit}
            disabled={pending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Menu principal</h2>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg p-4 space-y-3"
              style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-3 items-end">
                <div>
                  <label className={labelCls} style={{ color: "var(--text-muted)" }}>Label</label>
                  <input
                    className={inputCls}
                    style={inputStyle}
                    value={item.label}
                    onChange={(e) => updateItem(idx, { label: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ color: "var(--text-muted)" }}>Href</label>
                  <input
                    className={`${inputCls} font-mono`}
                    style={inputStyle}
                    value={item.href}
                    onChange={(e) => updateItem(idx, { href: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <IconButton onClick={() => moveItem(idx, -1)} disabled={idx === 0} aria-label="Monter">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </IconButton>
                  <IconButton onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} aria-label="Descendre">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </IconButton>
                  <IconButton onClick={() => removeItem(idx)} aria-label="Supprimer" danger>
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              </div>

              {item.children && item.children.length > 0 && (
                <div className="ml-4 pl-4 space-y-2 border-l" style={{ borderColor: "var(--border)" }}>
                  {item.children.map((child, cIdx) => (
                    <div key={cIdx} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-2 items-end">
                      <div>
                        <label className={labelCls} style={{ color: "var(--text-muted)" }}>Sous-label</label>
                        <input
                          className={inputCls}
                          style={inputStyle}
                          value={child.label}
                          onChange={(e) => updateChild(idx, cIdx, { label: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelCls} style={{ color: "var(--text-muted)" }}>Sous-href</label>
                        <input
                          className={`${inputCls} font-mono`}
                          style={inputStyle}
                          value={child.href}
                          onChange={(e) => updateChild(idx, cIdx, { href: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <IconButton onClick={() => moveChild(idx, cIdx, -1)} disabled={cIdx === 0} aria-label="Monter">
                          <ArrowUp className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton onClick={() => moveChild(idx, cIdx, 1)} disabled={cIdx === (item.children?.length || 0) - 1} aria-label="Descendre">
                          <ArrowDown className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton onClick={() => removeChild(idx, cIdx)} aria-label="Supprimer" danger>
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => addChild(idx)}
                className="inline-flex items-center gap-1 text-xs hover:text-primary"
                style={{ color: "var(--color-copper)" }}
              >
                <Plus className="h-3 w-3" /> Ajouter un sous-element
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          style={{ border: "1px solid var(--border)", color: "var(--text)" }}
        >
          <Plus className="h-3.5 w-3.5" /> Ajouter un lien principal
        </button>
      </section>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  disabled,
  danger,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:opacity-30"
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg-surface)",
        color: danger ? "var(--color-primary)" : "var(--text-secondary)",
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
