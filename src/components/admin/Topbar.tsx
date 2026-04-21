"use client";

import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationsPanel } from "./NotificationsPanel";

interface TopbarProps {
  title: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function Topbar({ title, breadcrumb }: TopbarProps) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    function onCount(e: Event) {
      const d = (e as CustomEvent).detail as { count?: number } | undefined;
      if (d && typeof d.count === "number") setUnread(d.count);
    }
    window.addEventListener("notifications-count", onCount as EventListener);
    return () => window.removeEventListener("notifications-count", onCount as EventListener);
  }, []);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-8 h-16 backdrop-blur-sm"
      style={{
        background: "color-mix(in oklab, var(--bg-surface) 85%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-2 text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {b.href ? (
                  <a href={b.href} className="transition-colors hover:text-[var(--text)]">{b.label}</a>
                ) : (
                  <span>{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-xl font-bold" style={{ color: "var(--text)" }}>{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-cmdk"))}
          className="flex items-center gap-2 rounded-lg px-3 h-9 text-xs transition-colors hover:bg-[var(--bg-muted)]"
          style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text-muted)" }}
          aria-label="Rechercher (Cmd+K)"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Rechercher</span>
          <kbd className="ml-2 font-mono text-[10px] opacity-60">⌘K</kbd>
        </button>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-notifications"))}
          className="relative flex items-center justify-center h-9 w-9 rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          aria-label={`Notifications${unread > 0 ? ` (${unread} non lues)` : ""}`}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-mono font-bold flex items-center justify-center"
              style={{ background: "var(--color-primary)", color: "white" }}
            >
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      </div>

      <NotificationsPanel />
    </header>
  );
}
