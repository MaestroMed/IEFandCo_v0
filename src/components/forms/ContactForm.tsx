"use client";

import { useState } from "react";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setSubmitted(true);
      else setError("Echec de l'envoi. Reessayez ou contactez-nous par telephone.");
    } catch {
      setError("Echec de l'envoi. Verifiez votre connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg p-12 text-center" style={{ border: "1px solid var(--border)", background: "var(--card-bg)" }}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold" style={{ color: "var(--text)" }}>
          Message envoye
        </h3>
        <p className="mt-2" style={{ color: "var(--text-muted)" }}>
          Nous reviendrons vers vous dans les meilleurs delais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="prenom"
            className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}
          >
            Prenom *
          </label>
          <input
            id="prenom"
            name="prenom"
            type="text"
            autoComplete="given-name"
            required
            className="w-full rounded-lg px-4 py-3 transition-colors focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
            placeholder="Votre prenom"
          />
        </div>
        <div>
          <label
            htmlFor="nom"
            className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}
          >
            Nom *
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            autoComplete="family-name"
            required
            className="w-full rounded-lg px-4 py-3 transition-colors focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="societe"
            className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}
          >
            Societe
          </label>
          <input
            id="societe"
            name="societe"
            type="text"
            autoComplete="organization"
            className="w-full rounded-lg px-4 py-3 transition-colors focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
            placeholder="Nom de votre societe"
          />
        </div>
        <div>
          <label
            htmlFor="telephone"
            className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}
          >
            Telephone *
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            autoComplete="tel"
            required
            className="w-full rounded-lg px-4 py-3 transition-colors focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
            placeholder="06 00 00 00 00"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}
        >
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg px-4 py-3 transition-colors focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="service"
          className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}
        >
          Service concerne
        </label>
        <select
          id="service"
          name="service"
          className="w-full rounded-lg px-4 py-3 transition-colors focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
        >
          <option value="">Selectionnez un service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg px-4 py-3 transition-colors focus:border-primary focus:outline-none resize-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
          placeholder="Decrivez votre projet..."
        />
      </div>

      {error && <p className="text-sm text-primary" role="alert">{error}</p>}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? "Envoi..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
