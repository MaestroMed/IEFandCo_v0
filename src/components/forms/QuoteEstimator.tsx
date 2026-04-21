"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

/**
 * QuoteEstimator — 3-step interactive calculator giving an instant estimate
 * range for the most common fermeture professionnelle services.
 *
 * Not a firm quote — shows a "Fourchette indicative" with strong disclaimer
 * pointing to /devis for an actual study + pricing.
 */

type EquipmentType =
  | "porte-sectionnelle"
  | "rideau-metallique"
  | "portail-automatique"
  | "porte-coupe-feu"
  | "maintenance-parc";

interface PricingRule {
  key: EquipmentType;
  label: string;
  icon: string;
  /** Base price for standard config (min & max of typical range) */
  base: [number, number];
  /** Price per additional unit (for maintenance per porte/year, or for size factor) */
  unit?: {
    label: string;
    min: number;
    max: number;
  };
  /** Motorization optional extra */
  motorization?: {
    label: string;
    price: [number, number];
  };
}

const PRICING: PricingRule[] = [
  {
    key: "porte-sectionnelle",
    label: "Porte sectionnelle industrielle",
    icon: "▦",
    base: [4500, 7500],
    motorization: { label: "Motorisation", price: [800, 1500] },
  },
  {
    key: "rideau-metallique",
    label: "Rideau métallique",
    icon: "≡",
    base: [2800, 5500],
    motorization: { label: "Motorisation", price: [600, 1200] },
  },
  {
    key: "portail-automatique",
    label: "Portail automatique",
    icon: "⊟",
    base: [3500, 7000],
    motorization: { label: "Automatisme (Came / Faac / Bft)", price: [1200, 2500] },
  },
  {
    key: "porte-coupe-feu",
    label: "Porte coupe-feu EI 60 / EI 120",
    icon: "▥",
    base: [1800, 4500],
  },
  {
    key: "maintenance-parc",
    label: "Contrat de maintenance (parc)",
    icon: "✓",
    base: [0, 0],
    unit: { label: "Prix par porte et par an", min: 480, max: 1750 },
  },
];

export function QuoteEstimator() {
  const [step, setStep] = useState(0);
  const [equipment, setEquipment] = useState<PricingRule | null>(null);
  const [size, setSize] = useState<"petit" | "standard" | "grand">("standard");
  const [withMotor, setWithMotor] = useState(true);
  const [quantity, setQuantity] = useState(5);

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => {
    setStep(0);
    setEquipment(null);
    setSize("standard");
    setWithMotor(true);
    setQuantity(5);
  };

  // Compute estimate range
  const computeEstimate = (): [number, number] => {
    if (!equipment) return [0, 0];

    // Maintenance uses per-porte pricing × quantity
    if (equipment.key === "maintenance-parc") {
      const unit = equipment.unit!;
      return [unit.min * quantity, unit.max * quantity];
    }

    // Base × size multiplier
    const sizeMultiplier = size === "petit" ? 0.75 : size === "grand" ? 1.35 : 1.0;
    const [baseMin, baseMax] = equipment.base;
    let min = baseMin * sizeMultiplier;
    let max = baseMax * sizeMultiplier;

    // Motorization
    if (withMotor && equipment.motorization) {
      min += equipment.motorization.price[0];
      max += equipment.motorization.price[1];
    }

    return [Math.round(min / 100) * 100, Math.round(max / 100) * 100];
  };

  const estimate = computeEstimate();

  const formatEuro = (n: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-bold transition-all duration-[var(--dur-md)]"
              style={{
                background: step >= i ? "var(--color-primary)" : "var(--bg-muted)",
                color: step >= i ? "white" : "var(--text-muted)",
                border: `1px solid ${step >= i ? "var(--color-primary)" : "var(--border)"}`,
              }}
            >
              {step > i ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {i < 2 && (
              <div
                className="h-px w-10 sm:w-16 transition-all duration-[var(--dur-md)]"
                style={{
                  background: step > i ? "var(--color-primary)" : "var(--border)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 0 — Choose equipment */}
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-display text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>
              Quel équipement vous intéresse ?
            </h3>
            <div className="grid gap-3">
              {PRICING.map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    setEquipment(p);
                    next();
                  }}
                  className="group flex items-center gap-4 rounded-xl p-5 text-left transition-all hover:-translate-y-0.5"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--card-shadow)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = "var(--card-shadow-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "var(--card-shadow)")
                  }
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-xl font-bold"
                    style={{
                      background: "rgba(196, 133, 92, 0.12)",
                      color: "var(--color-copper)",
                      border: "1px solid rgba(196, 133, 92, 0.25)",
                    }}
                  >
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-base font-semibold" style={{ color: "var(--text)" }}>
                      {p.label}
                    </div>
                    {p.key !== "maintenance-parc" && (
                      <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                        À partir de {formatEuro(p.base[0])} HT
                      </div>
                    )}
                    {p.key === "maintenance-parc" && (
                      <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                        À partir de {formatEuro(p.unit!.min)} / porte / an
                      </div>
                    )}
                  </div>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 1 — Configure */}
        {step === 1 && equipment && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-display text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>
              {equipment.label}
            </h3>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Précisez la configuration pour affiner l&apos;estimation.
            </p>

            {equipment.key === "maintenance-parc" ? (
              <div>
                <label className="block mb-3 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
                  Nombre de portes au contrat
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-xl font-bold text-xl transition-colors"
                    style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
                    aria-label="Diminuer"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                    className="flex-1 rounded-xl px-5 py-3 text-center text-lg font-bold"
                    style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                  <button
                    onClick={() => setQuantity((q) => Math.min(100, q + 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-xl font-bold text-xl transition-colors"
                    style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
                    aria-label="Augmenter"
                  >
                    +
                  </button>
                </div>
                <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  Tarif dégressif selon volume — l&apos;estimation tient compte du parc.
                </p>
              </div>
            ) : (
              <>
                {/* Size selector */}
                <div className="mb-8">
                  <label className="block mb-3 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
                    Dimensions
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "petit" as const, label: "Petit", desc: "<3m" },
                      { key: "standard" as const, label: "Standard", desc: "3-5m" },
                      { key: "grand" as const, label: "Grand", desc: ">5m" },
                    ].map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setSize(s.key)}
                        className="rounded-xl p-4 text-center transition-all"
                        style={{
                          background: size === s.key ? "rgba(225, 16, 33, 0.08)" : "var(--bg-muted)",
                          border: `1px solid ${size === s.key ? "var(--color-primary)" : "var(--border)"}`,
                          color: size === s.key ? "var(--color-primary)" : "var(--text)",
                        }}
                      >
                        <div className="font-display text-base font-bold">{s.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Motorization */}
                {equipment.motorization && (
                  <label className="flex items-center gap-3 rounded-xl p-4 cursor-pointer" style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
                    <input
                      type="checkbox"
                      checked={withMotor}
                      onChange={(e) => setWithMotor(e.target.checked)}
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        {equipment.motorization.label}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        + {formatEuro(equipment.motorization.price[0])} à {formatEuro(equipment.motorization.price[1])} HT
                      </div>
                    </div>
                  </label>
                )}
              </>
            )}

            <div className="mt-10 flex gap-3">
              <button
                onClick={prev}
                className="rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                style={{ background: "transparent", border: "1px solid var(--border-strong)", color: "var(--text)" }}
              >
                ← Précédent
              </button>
              <button
                onClick={next}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:scale-[1.01]"
                style={{
                  background: "var(--color-primary)",
                  boxShadow: "0 6px 20px rgba(225, 16, 33, 0.25)",
                }}
              >
                Calculer l&apos;estimation
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Estimate result */}
        {step === 2 && equipment && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                  Fourchette indicative
                </span>
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              </div>
              <div
                className="font-display tracking-tight font-bold mb-2"
                style={{ color: "var(--text)", fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: "1" }}
              >
                {formatEuro(estimate[0])} <span style={{ color: "var(--text-muted)" }}>—</span>{" "}
                <span className="text-gradient-metal">{formatEuro(estimate[1])}</span>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
                HT · {equipment.key === "maintenance-parc" ? `pour ${quantity} portes / an` : "pose comprise"}
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-xl p-5 mb-6" style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: "var(--color-copper)" }}>
                Récapitulatif
              </h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt style={{ color: "var(--text-muted)" }}>Équipement</dt>
                  <dd className="font-semibold" style={{ color: "var(--text)" }}>{equipment.label}</dd>
                </div>
                {equipment.key !== "maintenance-parc" && (
                  <>
                    <div className="flex justify-between">
                      <dt style={{ color: "var(--text-muted)" }}>Dimensions</dt>
                      <dd className="font-semibold capitalize" style={{ color: "var(--text)" }}>{size}</dd>
                    </div>
                    {equipment.motorization && (
                      <div className="flex justify-between">
                        <dt style={{ color: "var(--text-muted)" }}>Motorisation</dt>
                        <dd className="font-semibold" style={{ color: "var(--text)" }}>{withMotor ? "Incluse" : "Sans"}</dd>
                      </div>
                    )}
                  </>
                )}
                {equipment.key === "maintenance-parc" && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--text-muted)" }}>Nombre de portes</dt>
                    <dd className="font-semibold" style={{ color: "var(--text)" }}>{quantity}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Disclaimer */}
            <div
              className="rounded-xl p-4 mb-8 text-xs"
              style={{
                background: "rgba(196, 133, 92, 0.06)",
                border: "1px solid rgba(196, 133, 92, 0.2)",
                color: "var(--text-secondary)",
              }}
            >
              <p>
                <strong style={{ color: "var(--text)" }}>Estimation indicative</strong> basée sur des tarifs moyens 2026.
                Le devis final dépend des contraintes du site, finitions, normes applicables, et conditions d&apos;accès.
                <strong> Étude et devis personnalisés gratuits sous 48h.</strong>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/devis?service=${equipment.key}`}
                className="flex-1 inline-flex items-center justify-center rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.01]"
                style={{ background: "var(--color-primary)", boxShadow: "0 6px 20px rgba(225, 16, 33, 0.25)" }}
              >
                Obtenir un devis précis
              </Link>
              <button
                onClick={reset}
                className="rounded-xl px-5 py-3.5 text-sm font-semibold transition-colors"
                style={{ background: "transparent", border: "1px solid var(--border-strong)", color: "var(--text)" }}
              >
                Recommencer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
