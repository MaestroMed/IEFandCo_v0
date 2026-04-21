"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";

/**
 * Newsletter — B2B newsletter signup.
 * Submits to /api/newsletter (to be wired). For now, optimistic UX + console log.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErr("Email invalide");
      return;
    }
    setErr(null);
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || "Erreur lors de l'inscription");
        setStatus("error");
      }
    } catch {
      setErr("Erreur réseau");
      setStatus("error");
    }
  };

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Newsletter B2B
            </span>
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[1.05]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Les coulisses de <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>la métallerie pro</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: "var(--text-secondary)" }}>
            Normes, retours de chantier, guides techniques. Une newsletter mensuelle, 0 pub,
            désinscription en 1 clic.
          </p>

          <form
            onSubmit={submit}
            className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="nl-email" className="sr-only">
              Votre email professionnel
            </label>
            <input
              id="nl-email"
              type="email"
              autoComplete="email"
              placeholder="vous@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "submitting" || status === "success"}
              required
              className="flex-1 rounded-xl px-5 py-3 text-sm focus:outline-none disabled:opacity-60"
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              style={{
                background: "var(--color-primary)",
                boxShadow: "0 6px 20px rgba(225, 16, 33, 0.25)",
              }}
            >
              {status === "submitting"
                ? "Envoi..."
                : status === "success"
                  ? "✓ Inscrit"
                  : "S'inscrire"}
            </button>
          </form>

          {err && (
            <p className="mt-3 text-sm" style={{ color: "var(--color-primary)" }}>
              {err}
            </p>
          )}
          {status === "success" && (
            <p className="mt-3 text-sm" style={{ color: "var(--color-copper)" }}>
              Merci — vous recevrez notre prochaine édition.
            </p>
          )}

          <p className="mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
            En vous inscrivant, vous acceptez de recevoir nos communications professionnelles.
            Données traitées selon notre{" "}
            <a href="/politique-confidentialite" className="underline decoration-[var(--color-copper)] decoration-2 underline-offset-4">
              politique de confidentialité
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
