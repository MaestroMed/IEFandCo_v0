/**
 * List of static pages that support a per-page hero override.
 * Order : utilité utilisateur (commerce / leads d'abord, contenu ensuite).
 */
export const PAGE_HERO_KEYS: { key: string; label: string; description: string }[] = [
  { key: "a-propos", label: "A propos", description: "/a-propos" },
  { key: "services-index", label: "Services (index)", description: "/services" },
  { key: "realisations-index", label: "Realisations (index)", description: "/realisations" },
  { key: "contact", label: "Contact", description: "/contact" },
  { key: "devis", label: "Devis", description: "/devis" },
  { key: "assisteo", label: "Assisteo", description: "/assisteo" },
  { key: "estimateur", label: "Estimateur", description: "/estimateur" },
  { key: "maintenance-contrats", label: "Contrats de maintenance", description: "/maintenance/contrats" },
  { key: "depannage-index", label: "Depannage (index)", description: "/depannage" },
  { key: "comparatifs-index", label: "Comparatifs (index)", description: "/comparatifs" },
  { key: "blog-index", label: "Blog (index)", description: "/blog" },
  { key: "glossaire-index", label: "Glossaire", description: "/glossaire" },
  { key: "zones-intervention", label: "Zones d'intervention", description: "/zones-intervention" },
];
