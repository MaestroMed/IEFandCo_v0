"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Copy, Loader2, RefreshCw } from "lucide-react";
import { createUser } from "../actions";
import { ROLE_DESCRIPTIONS, USER_ROLES, USER_ROLE_LABELS, type UserRole } from "../constants";

interface Props {
  suggestedPassword: string;
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

function clientGenPassword(): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  if (typeof window !== "undefined" && window.crypto) {
    const buf = new Uint8Array(12);
    window.crypto.getRandomValues(buf);
    let out = "";
    for (let i = 0; i < 12; i++) out += charset[buf[i] % charset.length];
    return out;
  }
  // Fallback (should never run in client)
  let out = "";
  for (let i = 0; i < 12; i++) out += charset[Math.floor(Math.random() * charset.length)];
  return out;
}

export function InviteUserForm({ suggestedPassword }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    email: "",
    name: "",
    role: "editor" as UserRole,
    password: suggestedPassword,
  });
  const [createdInvite, setCreatedInvite] = useState<{ email: string; password: string } | null>(null);

  function regenerate() {
    setForm((f) => ({ ...f, password: clientGenPassword() }));
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
    toast.success("Copie");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.trim() || !form.name.trim()) {
      toast.error("Email et nom requis");
      return;
    }
    start(async () => {
      const res = await createUser(form);
      if (res.ok) {
        toast.success("Utilisateur cree");
        setCreatedInvite({ email: form.email, password: form.password });
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  if (createdInvite) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--color-copper)" }}>
          <div>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Invitation prete</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Communiquez ces identifiants au nouvel utilisateur. L&apos;envoi automatique d&apos;invitation par email arrive bientot
              <span className="ml-2 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                style={{ background: "var(--bg-muted)", color: "var(--color-copper)" }}>roadmap</span>.
            </p>
          </div>

          <div className="rounded-lg p-4 space-y-3" style={{ background: "var(--bg-muted)" }}>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Email</div>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm" style={{ color: "var(--text)" }}>{createdInvite.email}</code>
                <button onClick={() => copy(createdInvite.email)} className="text-xs" style={{ color: "var(--color-copper)" }}>
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Mot de passe temporaire</div>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm" style={{ color: "var(--text)" }}>{createdInvite.password}</code>
                <button onClick={() => copy(createdInvite.password)} className="text-xs" style={{ color: "var(--color-copper)" }}>
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/users")}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
            >
              Retour a la liste
            </button>
            <button
              onClick={() => {
                setCreatedInvite(null);
                setForm({ email: "", name: "", role: "editor", password: clientGenPassword() });
              }}
              className="rounded-lg px-5 py-2 text-sm"
              style={{ border: "1px solid var(--border)", color: "var(--text)" }}
            >
              Inviter un autre
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending && <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Creation...</span>}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Creer l&apos;utilisateur
          </button>
        </div>
      </div>

      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Profil</h2>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Nom complet</label>
          <input
            type="text"
            className={inputCls}
            style={inputStyle}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Prenom Nom"
          />
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Email</label>
          <input
            type="email"
            className={`${inputCls} font-mono`}
            style={inputStyle}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="prenom@iefandco.com"
          />
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Role</label>
          <select
            className={inputCls}
            style={inputStyle}
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
          >
            {USER_ROLES.map((r) => (
              <option key={r} value={r}>{USER_ROLE_LABELS[r]}</option>
            ))}
          </select>
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
            {ROLE_DESCRIPTIONS[form.role]}
          </p>
        </div>
      </section>

      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Mot de passe temporaire</h2>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Mot de passe</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className={`${inputCls} font-mono`}
              style={inputStyle}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
            <button
              type="button"
              onClick={regenerate}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs"
              style={{ border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <RefreshCw className="h-3 w-3" /> Regenerer
            </button>
          </div>
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
            L&apos;utilisateur sera invite a le changer a la premiere connexion.
          </p>
        </div>
      </section>
    </form>
  );
}
