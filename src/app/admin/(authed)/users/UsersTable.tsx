"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, KeyRound, Loader2 } from "lucide-react";
import { changeUserRole, resetUserPassword } from "./actions";
import { USER_ROLES, USER_ROLE_LABELS, type UserRole } from "./constants";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  lastSeenAt: number | null;
  createdAt: number;
  activeSessions: number;
}

interface Props {
  currentUserId: string;
  users: UserRow[];
}

export function UsersTable({ currentUserId, users }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [resetResult, setResetResult] = useState<{ userId: string; tempPassword: string } | null>(null);

  function onRoleChange(userId: string, role: UserRole) {
    start(async () => {
      const res = await changeUserRole(userId, role);
      if (res.ok) {
        toast.success("Role mis a jour");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function onReset(userId: string) {
    if (!confirm("Reinitialiser le mot de passe ? Toutes les sessions seront revoquees.")) return;
    start(async () => {
      const res = await resetUserPassword(userId);
      if (res.ok) {
        setResetResult({ userId, tempPassword: res.tempPassword });
        toast.success("Mot de passe reinitialise");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function copyPwd(pwd: string) {
    navigator.clipboard?.writeText(pwd);
    toast.success("Mot de passe copie");
  }

  return (
    <>
      {resetResult && (
        <div
          className="rounded-xl p-4 mb-4"
          style={{
            background: "color-mix(in oklab, var(--color-copper) 8%, var(--card-bg))",
            border: "1px solid var(--color-copper)",
          }}
        >
          <div className="flex items-start gap-3">
            <KeyRound className="h-5 w-5 mt-0.5" style={{ color: "var(--color-copper)" }} />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Mot de passe temporaire (visible une seule fois)
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Communiquez ce mot de passe a l&apos;utilisateur. Il devra le changer a la premiere connexion.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <code className="rounded-md px-3 py-1.5 font-mono text-sm" style={{ background: "var(--bg-muted)", color: "var(--text)" }}>
                  {resetResult.tempPassword}
                </code>
                <button
                  onClick={() => copyPwd(resetResult.tempPassword)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  <Copy className="h-3 w-3" /> Copier
                </button>
                <button
                  onClick={() => setResetResult(null)}
                  className="ml-auto text-xs hover:text-primary"
                  style={{ color: "var(--text-muted)" }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Sessions</th>
              <th className="px-4 py-3 font-medium">Derniere visite</th>
              <th className="px-4 py-3 font-medium">Cree</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${u.id}`} className="font-medium hover:text-primary" style={{ color: "var(--text)" }}>
                    {u.name}
                    {u.id === currentUserId && (
                      <span className="ml-2 text-[10px] font-mono uppercase" style={{ color: "var(--color-copper)" }}>(vous)</span>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    disabled={pending || u.id === currentUserId}
                    onChange={(e) => onRoleChange(u.id, e.target.value as UserRole)}
                    className="rounded-md px-2 py-1 text-xs"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    {USER_ROLES.map((r) => (
                      <option key={r} value={r}>{USER_ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text)" }}>{u.activeSessions}</td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                  {u.lastSeenAt ? new Date(u.lastSeenAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                  {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onReset(u.id)}
                    disabled={pending}
                    className="inline-flex items-center gap-1 text-xs hover:text-primary disabled:opacity-50"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <KeyRound className="h-3 w-3" />}
                    Reset MDP
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
