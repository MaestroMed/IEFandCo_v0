"use client";

import { Command } from "cmdk";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Inbox, FolderKanban, FileText, Wrench,
  Users, MessageSquare, Building2, Image as ImageIcon,
  Calendar, Mail, Search, Settings, UserCog, History,
  LogOut, Plus, ExternalLink, Loader2, FileSearch,
} from "lucide-react";

interface SearchResult {
  type: "lead" | "project" | "blog" | "service" | "team";
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

const NAV_ITEMS: { href: string; label: string; icon: typeof Inbox }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/projects", label: "Realisations", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/team", label: "Equipe", icon: Users },
  { href: "/admin/testimonials", label: "Temoignages", icon: MessageSquare },
  { href: "/admin/clients", label: "Clients", icon: Building2 },
  { href: "/admin/media", label: "Mediatheque", icon: ImageIcon },
  { href: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/admin/calendar", label: "Planning", icon: Calendar },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/settings", label: "Parametres", icon: Settings },
  { href: "/admin/users", label: "Utilisateurs", icon: UserCog },
  { href: "/admin/audit", label: "Audit", icon: History },
];

const ACTIONS: { label: string; href?: string; icon: typeof Plus; onSelect?: "site" | "logout" }[] = [
  { label: "Nouveau lead", href: "/admin/leads", icon: Plus },
  { label: "Nouveau projet", href: "/admin/projects/new", icon: Plus },
  { label: "Nouvel article", href: "/admin/blog/new", icon: Plus },
  { label: "Nouvelle visite", href: "/admin/maintenance/visits/new", icon: Plus },
  { label: "Nouveau temoignage", href: "/admin/testimonials/new", icon: Plus },
  { label: "Inviter un utilisateur", href: "/admin/users/new", icon: Plus },
  { label: "Voir le site public", icon: ExternalLink, onSelect: "site" },
  { label: "Deconnexion", icon: LogOut, onSelect: "logout" },
];

const TYPE_ICONS: Record<SearchResult["type"], typeof Inbox> = {
  lead: Inbox,
  project: FolderKanban,
  blog: FileText,
  service: Wrench,
  team: Users,
};

const TYPE_LABELS: Record<SearchResult["type"], string> = {
  lead: "Lead",
  project: "Projet",
  blog: "Article",
  service: "Service",
  team: "Equipe",
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const lastKeyRef = useRef<{ key: string; at: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open via cmdk button event from Topbar
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-cmdk", onOpen as EventListener);
    return () => window.removeEventListener("open-cmdk", onOpen as EventListener);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    function isTypingTarget(t: EventTarget | null): boolean {
      if (!t || !(t instanceof HTMLElement)) return false;
      const tag = t.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable;
    }

    function onKey(e: KeyboardEvent) {
      // Cmd/Ctrl + K → toggle palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // Cmd/Ctrl + / → toggle keyboard cheat sheet
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }

      if (open) return; // chord shortcuts disabled while palette open

      // Skip when user is typing in another field
      if (isTypingTarget(e.target)) return;

      const now = Date.now();
      const k = e.key.toLowerCase();

      // ? alone → cheat sheet
      if (k === "?" || (k === "/" && e.shiftKey)) {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }

      // Two-key chord: G then L/P/B/D
      if (lastKeyRef.current && lastKeyRef.current.key === "g" && now - lastKeyRef.current.at < 1000) {
        const map: Record<string, string> = {
          l: "/admin/leads",
          p: "/admin/projects",
          b: "/admin/blog",
          d: "/admin",
        };
        if (map[k]) {
          e.preventDefault();
          router.push(map[k]);
          lastKeyRef.current = null;
          return;
        }
      }
      if (k === "g") {
        lastKeyRef.current = { key: "g", at: now };
        return;
      }
      // N press while palette closed → reserved for future "create" submenu
      // (intentionally not implemented)
      lastKeyRef.current = null;
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, router]);

  // Esc closes help dialog
  useEffect(() => {
    if (!helpOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setHelpOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [helpOpen]);

  // Reset query when closing
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    } else {
      // focus input on open
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`, {
          signal: ctrl.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch {
        // ignore aborts
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query]);

  function go(url: string) {
    setOpen(false);
    router.push(url);
  }

  async function logout() {
    setOpen(false);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function openPublic() {
    setOpen(false);
    window.open("/", "_blank");
  }

  return (
    <>
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Palette de commandes"
      shouldFilter={true}
      className="cmdk-root"
    >
      <div
        className="fixed inset-0 z-[60]"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-[15vh] z-[61] w-full max-w-xl -translate-x-1/2 px-4">
        <div
          className="overflow-hidden rounded-xl shadow-2xl"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
            <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder="Rechercher une action, page, ou contenu..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
              style={{ color: "var(--text)" }}
            />
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: "var(--text-muted)" }} />}
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--bg-muted)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              Esc
            </kbd>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              Aucun resultat.
            </Command.Empty>

            <Command.Group
              heading="Navigation"
              className="cmdk-group"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.href}
                    value={`nav ${item.label}`}
                    onSelect={() => go(item.href)}
                    className="cmdk-item"
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                    <span style={{ color: "var(--text)" }}>{item.label}</span>
                    <span className="ml-auto font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {item.href}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading="Actions" className="cmdk-group">
              {ACTIONS.map((a) => {
                const Icon = a.icon;
                return (
                  <Command.Item
                    key={a.label}
                    value={`action ${a.label}`}
                    onSelect={() => {
                      if (a.onSelect === "site") openPublic();
                      else if (a.onSelect === "logout") logout();
                      else if (a.href) go(a.href);
                    }}
                    className="cmdk-item"
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--color-copper)" }} />
                    <span style={{ color: "var(--text)" }}>{a.label}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            {query.trim().length >= 2 && (
              <Command.Group
                heading={`Recherche contenu${results.length ? ` (${results.length})` : ""}`}
                className="cmdk-group"
              >
                {results.length === 0 && !loading && (
                  <div className="px-3 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    Aucun contenu trouve pour &laquo; {query} &raquo;.
                  </div>
                )}
                {results.map((r) => {
                  const Icon = TYPE_ICONS[r.type];
                  return (
                    <Command.Item
                      key={`${r.type}-${r.id}`}
                      value={`content ${r.type} ${r.title} ${r.subtitle || ""}`}
                      onSelect={() => go(r.url)}
                      className="cmdk-item"
                    >
                      <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm" style={{ color: "var(--text)" }}>{r.title}</div>
                        {r.subtitle && (
                          <div className="truncate text-[10px]" style={{ color: "var(--text-muted)" }}>{r.subtitle}</div>
                        )}
                      </div>
                      <span
                        className="ml-2 font-mono text-[9px] uppercase tracking-wider rounded px-1.5 py-0.5 shrink-0"
                        style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}
                      >
                        {TYPE_LABELS[r.type]}
                      </span>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}
          </Command.List>

          <div
            className="flex items-center justify-between border-t px-4 py-2 text-[10px] font-mono"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-muted)" }}
          >
            <div className="flex items-center gap-3">
              <span><kbd>↑↓</kbd> naviguer</span>
              <span><kbd>↵</kbd> ouvrir</span>
              <span><kbd>g</kbd> + <kbd>l/p/b/d</kbd> aller a</span>
              <span><kbd>?</kbd> aide</span>
            </div>
            <span className="flex items-center gap-1">
              <FileSearch className="h-3 w-3" /> palette
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .cmdk-group [cmdk-group-heading] {
          padding: 0.5rem 0.75rem 0.25rem;
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .cmdk-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 120ms ease;
        }
        .cmdk-item[data-selected="true"] {
          background: var(--bg-muted);
        }
        .cmdk-item:hover {
          background: var(--bg-muted);
        }
        .cmdk-root [cmdk-list-sizer] {
          padding: 0;
        }
      `}</style>
    </Command.Dialog>

    {helpOpen && (
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={() => setHelpOpen(false)}
      >
        <div
          className="w-full max-w-md rounded-xl shadow-2xl"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "var(--border)" }}>
            <h2 className="font-display text-base font-semibold" style={{ color: "var(--text)" }}>
              Raccourcis clavier
            </h2>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--bg-muted)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              Esc
            </kbd>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <ShortcutSection title="General" items={[
              { keys: ["⌘", "K"], label: "Ouvrir la palette" },
              { keys: ["⌘", "/"], label: "Afficher cette aide" },
              { keys: ["?"], label: "Afficher cette aide" },
              { keys: ["Esc"], label: "Fermer / annuler" },
            ]} />
            <ShortcutSection title="Navigation rapide" items={[
              { keys: ["G", "D"], label: "Aller au Dashboard" },
              { keys: ["G", "L"], label: "Aller aux Leads" },
              { keys: ["G", "P"], label: "Aller aux Realisations" },
              { keys: ["G", "B"], label: "Aller au Blog" },
            ]} />
            <ShortcutSection title="Dans la palette" items={[
              { keys: ["↑", "↓"], label: "Naviguer" },
              { keys: ["↵"], label: "Selectionner" },
            ]} />
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function ShortcutSection({ title, items }: { title: string; items: { keys: string[]; label: string }[] }) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-muted)" }}>
        {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between">
            <span style={{ color: "var(--text)" }}>{it.label}</span>
            <span className="flex items-center gap-1">
              {it.keys.map((k, j) => (
                <kbd
                  key={j}
                  className="inline-flex h-6 min-w-[24px] items-center justify-center font-mono text-[11px] px-1.5 rounded"
                  style={{ background: "var(--bg-muted)", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  {k}
                </kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
