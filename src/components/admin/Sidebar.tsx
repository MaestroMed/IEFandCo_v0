"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Inbox, FolderKanban, FileText, Wrench,
  Users, MessageSquare, Building2, Image as ImageIcon,
  Calendar, Mail,
  Search, Settings, UserCog, History,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  userName: string;
  userRole: string;
}

const nav = [
  // Pilotage (0..6)
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/leads", icon: Inbox, label: "Leads", badge: true },
  { href: "/admin/maintenance", icon: Wrench, label: "Maintenance" },
  { href: "/admin/calendar", icon: Calendar, label: "Planning" },
  { href: "/admin/emails", icon: Mail, label: "Emails" },
  { href: "/admin/projects", icon: FolderKanban, label: "Realisations" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  // Contenu (7..10)
  { href: "/admin/services", icon: Wrench, label: "Services" },
  { href: "/admin/team", icon: Users, label: "Equipe" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Temoignages" },
  { href: "/admin/clients", icon: Building2, label: "Clients" },
  // Ressources (11..12)
  { href: "/admin/media", icon: ImageIcon, label: "Medias" },
  { href: "/admin/seo", icon: Search, label: "SEO" },
  // Administration (13..15)
  { href: "/admin/settings", icon: Settings, label: "Parametres" },
  { href: "/admin/users", icon: UserCog, label: "Utilisateurs" },
  { href: "/admin/audit", icon: History, label: "Audit" },
];

export function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-30"
      style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo + site link */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold" style={{ color: "var(--text)" }}>
            IEF<span className="text-primary">&</span>CO
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
            ADMIN
          </span>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="mt-1 block text-xs transition-colors hover:text-primary"
          style={{ color: "var(--text-muted)" }}
        >
          Voir le site public →
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
          Pilotage
        </div>
        <ul className="space-y-0.5">
          {nav.slice(0, 7).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                  style={{
                    background: active ? "var(--bg-muted)" : "transparent",
                    color: active ? "var(--text)" : "var(--text-secondary)",
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
          Contenu
        </div>
        <ul className="space-y-0.5">
          {nav.slice(7, 11).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                  style={{
                    background: active ? "var(--bg-muted)" : "transparent",
                    color: active ? "var(--text)" : "var(--text-secondary)",
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
          Ressources
        </div>
        <ul className="space-y-0.5">
          {nav.slice(11, 13).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                  style={{
                    background: active ? "var(--bg-muted)" : "transparent",
                    color: active ? "var(--text)" : "var(--text-secondary)",
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
          Administration
        </div>
        <ul className="space-y-0.5">
          {nav.slice(13).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                  style={{
                    background: active ? "var(--bg-muted)" : "transparent",
                    color: active ? "var(--text)" : "var(--text-secondary)",
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: user + logout */}
      <div className="border-t p-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: "var(--bg-muted)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold" style={{ background: "var(--color-copper)", color: "white" }}>
            {userName.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{userName}</p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{userRole}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-surface)]"
            style={{ color: "var(--text-muted)" }}
            aria-label="Deconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
