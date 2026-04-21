"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, Inbox, Wrench, FileText, History, Check, Loader2 } from "lucide-react";

type Kind = "lead" | "visit" | "blog" | "audit";

interface Item {
  id: string;
  kind: Kind;
  at: string;
  title: string;
  subtitle?: string;
  url: string;
}

const KIND_ICONS: Record<Kind, typeof Inbox> = {
  lead: Inbox,
  visit: Wrench,
  blog: FileText,
  audit: History,
};

const KIND_COLORS: Record<Kind, string> = {
  lead: "var(--color-primary)",
  visit: "var(--color-copper)",
  blog: "#3B82B4",
  audit: "var(--text-muted)",
};

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const m = 60 * 1000;
  const h = 60 * m;
  const day = 24 * h;
  const future = diff > 0;
  const fmt = (n: number, unit: string) => `${future ? "dans " : "il y a "}${n} ${unit}${n > 1 ? "s" : ""}`;
  if (abs < m) return future ? "imminent" : "a l'instant";
  if (abs < h) return fmt(Math.round(abs / m), "minute");
  if (abs < day) return fmt(Math.round(abs / h), "heure");
  if (abs < 7 * day) return fmt(Math.round(abs / day), "jour");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function NotificationsPanel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (r.ok) {
        const d = await r.json();
        setItems(d.items || []);
        setUnread(d.unread || 0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + poll every 90s when open is closed (cheap badge update)
  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 90_000);
    return () => clearInterval(t);
  }, [fetchData]);

  // Refresh when opening
  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // Listen for "open-notifications" event from Topbar
  useEffect(() => {
    const onOpen = () => setOpen((v) => !v);
    window.addEventListener("toggle-notifications", onOpen as EventListener);
    return () => window.removeEventListener("toggle-notifications", onOpen as EventListener);
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Notify parent (Topbar bell) of unread count via custom event
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("notifications-count", { detail: { count: unread } }));
  }, [unread]);

  async function markRead() {
    setMarking(true);
    try {
      await fetch("/api/admin/notifications", { method: "POST" });
      setUnread(0);
    } finally {
      setMarking(false);
    }
  }

  function pick(item: Item) {
    setOpen(false);
    router.push(item.url);
  }

  if (!open) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed right-4 top-16 z-40 w-[380px] max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl overflow-hidden"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
          <span className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>
            Notifications
          </span>
          {unread > 0 && (
            <span
              className="rounded-full px-1.5 py-0.5 font-mono text-[10px]"
              style={{ background: "var(--color-primary)", color: "white" }}
            >
              {unread}
            </span>
          )}
        </div>
        <button
          type="button"
          disabled={marking || unread === 0}
          onClick={markRead}
          className="inline-flex items-center gap-1.5 text-[11px] disabled:opacity-40"
          style={{ color: "var(--color-copper)" }}
        >
          {marking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
          Marquer comme lu
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading && items.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            <Loader2 className="mx-auto mb-2 h-4 w-4 animate-spin" />
            Chargement...
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <Bell className="mx-auto h-8 w-8 opacity-20" />
            <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>Tout est calme.</p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Les leads recents et evenements de l&apos;equipe apparaitront ici.
            </p>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {items.map((it) => {
              const Icon = KIND_ICONS[it.kind];
              return (
                <li
                  key={it.id}
                  className="cursor-pointer transition-colors hover:bg-[var(--bg-muted)]"
                  onClick={() => pick(it)}
                >
                  <div className="flex gap-3 px-4 py-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "var(--bg-muted)" }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: KIND_COLORS[it.kind] }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-tight" style={{ color: "var(--text)" }}>{it.title}</p>
                      {it.subtitle && (
                        <p className="mt-0.5 truncate text-[11px]" style={{ color: "var(--text-muted)" }}>{it.subtitle}</p>
                      )}
                      <p className="mt-1 font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {formatRelative(it.at)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div
        className="px-4 py-2 border-t text-[10px] font-mono text-center"
        style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-muted)" }}
      >
        Mises a jour automatiquement
      </div>
    </div>
  );
}
