"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Erreur de connexion");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Erreur reseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-8 relative" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l border-t" style={{ borderColor: "var(--blueprint-ink)" }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-r border-t" style={{ borderColor: "var(--blueprint-ink)" }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b" style={{ borderColor: "var(--blueprint-ink)" }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b" style={{ borderColor: "var(--blueprint-ink)" }} />

      <h1 className="font-display text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Connexion</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
          <input
            type="email"
            required
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
            style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Mot de passe</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
            style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg p-3 text-sm" style={{ background: "rgba(225,16,33,0.08)", border: "1px solid rgba(225,16,33,0.3)", color: "var(--color-primary)" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      {process.env.NODE_ENV !== "production" && (
        <p className="mt-6 text-xs text-center" style={{ color: "var(--text-muted)" }}>
          Default dev : <code>admin@iefandco.com</code> / <code>admin1234</code>
        </p>
      )}
    </form>
  );
}
