"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Trash2 } from "lucide-react";
import { deleteUser, revokeSession, updateUser } from "../actions";
import { ROLE_DESCRIPTIONS, USER_ROLES, USER_ROLE_LABELS, type UserRole } from "../constants";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: number;
  lastSeenAt: number | null;
}

interface SessionData {
  id: string;
  createdAt: number;
  expiresAt: number;
}

interface Props {
  currentUserId: string;
  user: UserData;
  sessions: SessionData[];
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function UserDetail({ currentUserId, user, sessions }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role as UserRole);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isSelf = currentUserId === user.id;

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await updateUser(user.id, { name, role });
      if (res.ok) {
        toast.success("Utilisateur mis a jour");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function onDelete() {
    start(async () => {
      const res = await deleteUser(user.id);
      if (res.ok) {
        toast.success("Utilisateur supprime");
        router.push("/admin/users");
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function onRevoke(sessionId: string) {
    start(async () => {
      const res = await revokeSession(sessionId);
      if (res.ok) {
        toast.success("Session revoquee");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  const now = Date.now();

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending && <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> En cours...</span>}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Retour
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Profil</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Nom</label>
              <input
                type="text"
                className={inputCls}
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Email (lecture seule)</label>
              <input
                type="email"
                readOnly
                className={`${inputCls} font-mono`}
                style={{ ...inputStyle, opacity: 0.7 }}
                value={user.email}
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Role</label>
              <select
                className={inputCls}
                style={inputStyle}
                value={role}
                disabled={isSelf}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>{USER_ROLE_LABELS[r]}</option>
                ))}
              </select>
              <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                {ROLE_DESCRIPTIONS[role]}
              </p>
              {isSelf && (
                <p className="mt-1 text-[11px]" style={{ color: "var(--color-copper)" }}>
                  Vous ne pouvez pas modifier votre propre role.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
                Sessions actives ({sessions.filter((s) => s.expiresAt > now).length})
              </h2>
              <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                {sessions.length} session{sessions.length > 1 ? "s" : ""} au total
              </span>
            </div>
            {sessions.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Aucune session enregistree.</p>
            ) : (
              <ul className="space-y-2">
                {sessions.map((s) => {
                  const expired = s.expiresAt < now;
                  return (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-3 rounded-lg p-3 text-sm"
                      style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs truncate" style={{ color: "var(--text)" }}>
                          {s.id.slice(0, 16)}…
                        </div>
                        <div className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Cree {new Date(s.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })} ·
                          {" "}{expired ? "expire" : "expire"} {new Date(s.expiresAt).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                        style={{
                          background: expired ? "var(--bg-muted)" : "rgba(60,170,140,0.15)",
                          color: expired ? "var(--text-muted)" : "#3CAA8C",
                        }}
                      >
                        {expired ? "expiree" : "active"}
                      </span>
                      {!expired && (
                        <button
                          type="button"
                          onClick={() => onRevoke(s.id)}
                          disabled={pending}
                          className="inline-flex items-center gap-1 text-xs hover:text-primary disabled:opacity-50"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <LogOut className="h-3 w-3" /> Revoquer
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Metadonnees</h2>
            <div className="space-y-2 font-mono text-xs">
              <Row label="ID" value={user.id} />
              <Row label="Cree le" value={new Date(user.createdAt).toLocaleDateString("fr-FR")} />
              <Row label="Vu" value={user.lastSeenAt ? new Date(user.lastSeenAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—"} />
            </div>
          </section>

          {!isSelf && (
            <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Zone dangereuse</h2>
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 text-sm hover:opacity-80"
                  style={{ color: "var(--color-primary)" }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer l&apos;utilisateur
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs" style={{ color: "var(--text)" }}>
                    Toutes les sessions seront revoquees. Cette action est irreversible.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onDelete}
                      disabled={pending}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Supprimer definitivement
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="rounded-lg px-3 py-1.5 text-xs"
                      style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="uppercase tracking-wider text-[10px]" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="truncate text-right" style={{ color: "var(--text-secondary)" }}>{value}</span>
    </div>
  );
}
