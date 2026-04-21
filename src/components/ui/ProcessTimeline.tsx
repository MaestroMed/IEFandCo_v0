"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Relevé & étude",
    description:
      "Visite sur site, prise de cotes, analyse des contraintes. Notre bureau d'étude modélise en 3D et calcule chaque élément selon l'Eurocode 3.",
  },
  {
    number: "02",
    title: "Plans d'exécution",
    description:
      "Modélisation 3D, notes de calcul, plans de fabrication. Validation avec le client avant lancement en production.",
  },
  {
    number: "03",
    title: "Fabrication atelier",
    description:
      "Découpe, soudure, assemblage dans notre atelier. Contrôle qualité par WPQR. Traitement de surface selon l'environnement final.",
  },
  {
    number: "04",
    title: "Pose sur chantier",
    description:
      "Équipes formées au travail en hauteur. Coordination avec les autres corps d'état. Livraison dans les délais.",
  },
  {
    number: "05",
    title: "Maintenance",
    description:
      "Contrat d'entretien préventif, dépannage 24/7, carnet d'entretien digital. Nous accompagnons vos ouvrages dans la durée.",
  },
];

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-4xl px-6">
      {/* Vertical guide line */}
      <div
        className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px"
        style={{ background: "var(--border)" }}
      />
      {/* Scroll-driven progress line */}
      <motion.div
        className="absolute left-8 md:left-1/2 top-0 w-px origin-top"
        style={{
          height: lineHeight,
          background: "linear-gradient(to bottom, var(--color-copper), var(--color-primary))",
          boxShadow: "0 0 10px rgba(196, 133, 92, 0.4)",
        }}
      />

      <div className="space-y-20 md:space-y-32">
        {steps.map((step, i) => (
          <TimelineStep key={i} step={step} index={i} />
        ))}
      </div>
    </div>
  );
}

function TimelineStep({ step, index }: { step: Step; index: number }) {
  const alignRight = index % 2 === 1;
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Number dot on line */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full font-mono text-sm font-bold"
          style={{
            background: "var(--bg)",
            border: "2px solid var(--color-copper)",
            color: "var(--color-copper)",
            boxShadow: "0 0 20px rgba(196, 133, 92, 0.15)",
          }}
          whileInView={{ scale: [0.8, 1.1, 1] }}
          transition={{ duration: 0.6, times: [0, 0.5, 1] }}
          viewport={{ once: true }}
        >
          {step.number}
        </motion.div>
      </div>

      {/* Content card */}
      <div className={`pl-28 md:pl-0 md:grid md:grid-cols-2 md:gap-16 ${alignRight ? "md:[&>*:first-child]:col-start-2" : ""}`}>
        <div className={`md:max-w-sm ${alignRight ? "md:text-left md:ml-16" : "md:text-right md:mr-16 md:ml-auto"}`}>
          <h3 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            {step.title}
          </h3>
          <p className="mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
