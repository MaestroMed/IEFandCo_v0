"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";

const steps = [
  { label: "Projet", number: 1 },
  { label: "Details", number: 2 },
  { label: "Contact", number: 3 },
  { label: "Recap", number: 4 },
];

export function DevisMultiStep() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    service: "",
    description: "",
    urgence: "",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    societe: "",
    adresse: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!data.service) newErrors.service = "Selectionnez un service";
      if (!data.description.trim()) newErrors.description = "Decrivez votre projet";
    }
    if (s === 3) {
      if (!data.prenom.trim()) newErrors.prenom = "Requis";
      if (!data.nom.trim()) newErrors.nom = "Requis";
      if (!data.email.trim()) newErrors.email = "Requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Email invalide";
      if (!data.telephone.trim()) newErrors.telephone = "Requis";
      else if (!/^[\d\s+()-]{8,}$/.test(data.telephone)) newErrors.telephone = "Numero invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) { setStep(3); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setSubmitted(true);
      else setErrors({ submit: "Echec de l'envoi. Reessayez ou contactez-nous par telephone." });
    } catch {
      setErrors({ submit: "Echec de l'envoi. Verifiez votre connexion." });
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
          Demande envoyee
        </h3>
        <p className="mt-2" style={{ color: "var(--text-muted)" }}>
          Nous reviendrons vers vous sous 48h avec un devis detaille.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-10 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                step >= s.number
                  ? "bg-primary"
                  : ""
              }`}
              style={step >= s.number
                ? { color: "var(--text-inverse)" }
                : { border: "1px solid var(--border)", color: "var(--text-muted)" }
              }
            >
              {step > s.number ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                s.number
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-3 h-px w-12 sm:w-20 transition-colors ${
                  step > s.number ? "bg-primary" : ""
                }`}
                style={step > s.number ? {} : { background: "var(--border)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {step === 1 && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Type de service *
                </label>
                <select
                  value={data.service}
                  onChange={(e) => update("service", e.target.value)}
                  className="w-full rounded-lg px-4 py-3 focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
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
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Description du projet *
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-lg px-4 py-3 focus:border-primary focus:outline-none resize-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
                  placeholder="Decrivez votre besoin..."
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Urgence
                </label>
                <select
                  value={data.urgence}
                  onChange={(e) => update("urgence", e.target.value)}
                  className="w-full rounded-lg px-4 py-3 focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
                >
                  <option value="">Selectionnez</option>
                  <option value="normal">Normal (2-4 semaines)</option>
                  <option value="urgent">Urgent (moins d&apos;1 semaine)</option>
                  <option value="planifie">Planifie (plus d&apos;1 mois)</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Adresse du site
                </label>
                <input
                  autoComplete="street-address"
                  value={data.adresse}
                  onChange={(e) => update("adresse", e.target.value)}
                  className="w-full rounded-lg px-4 py-3 focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
                  placeholder="Adresse d'intervention"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Prenom *
                  </label>
                  <input
                    autoComplete="given-name"
                    value={data.prenom}
                    onChange={(e) => update("prenom", e.target.value)}
                    className="w-full rounded-lg px-4 py-3 focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Nom *
                  </label>
                  <input
                    autoComplete="family-name"
                    value={data.nom}
                    onChange={(e) => update("nom", e.target.value)}
                    className="w-full rounded-lg px-4 py-3 focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Email *
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full rounded-lg px-4 py-3 focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Telephone *
                  </label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={data.telephone}
                    onChange={(e) => update("telephone", e.target.value)}
                    className="w-full rounded-lg px-4 py-3 focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Societe
                  </label>
                  <input
                    autoComplete="organization"
                    value={data.societe}
                    onChange={(e) => update("societe", e.target.value)}
                    className="w-full rounded-lg px-4 py-3 focus:border-primary focus:outline-none" style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text)" }}
                  />
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="rounded-lg p-6 space-y-4" style={{ border: "1px solid var(--border)", background: "var(--card-bg)" }}>
              <h3 className="font-display text-lg font-semibold" style={{ color: "var(--text)" }}>
                Recapitulatif
              </h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between pb-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Service</span>
                  <span style={{ color: "var(--text)" }}>
                    {services.find((s) => s.slug === data.service)?.title ||
                      "Non renseigne"}
                  </span>
                </div>
                <div className="flex justify-between pb-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Contact</span>
                  <span style={{ color: "var(--text)" }}>
                    {data.prenom} {data.nom}
                  </span>
                </div>
                <div className="flex justify-between pb-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Email</span>
                  <span style={{ color: "var(--text)" }}>{data.email}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Telephone</span>
                  <span style={{ color: "var(--text)" }}>{data.telephone}</span>
                </div>
              </div>
              {data.description && (
                <div className="mt-4">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Description :</span>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {data.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Error message */}
      {errors.submit && (
        <p className="mt-4 text-sm text-primary" role="alert">{errors.submit}</p>
      )}
      {/* Field errors summary */}
      {Object.entries(errors).filter(([k]) => k !== "submit").length > 0 && (
        <div className="mt-4 rounded-lg p-4 text-sm" style={{ background: "rgba(225,16,33,0.06)", border: "1px solid rgba(225,16,33,0.2)", color: "var(--text)" }} role="alert">
          <p className="font-semibold text-primary">Veuillez corriger :</p>
          <ul className="mt-1 list-disc pl-5" style={{ color: "var(--text-secondary)" }}>
            {Object.entries(errors).filter(([k]) => k !== "submit").map(([k, v]) => (<li key={k}>{k} : {v}</li>))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
            Retour
          </Button>
        ) : (
          <div />
        )}
        {step < 4 ? (
          <Button onClick={handleNext}>Suivant</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Envoi..." : "Envoyer la demande"}
          </Button>
        )}
      </div>
    </div>
  );
}
