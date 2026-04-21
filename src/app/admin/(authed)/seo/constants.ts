export const STATIC_PAGES = [
  { key: "home", path: "/", name: "Accueil" },
  { key: "a-propos", path: "/a-propos", name: "A propos" },
  { key: "contact", path: "/contact", name: "Contact" },
  { key: "assisteo", path: "/assisteo", name: "Assisteo" },
] as const;

export type StaticPageKey = typeof STATIC_PAGES[number]["key"];

export const REDIRECT_STATUS_CODES = [
  { value: 301, label: "301 — Permanente" },
  { value: 302, label: "302 — Temporaire" },
  { value: 307, label: "307 — Temporaire (preserve methode)" },
  { value: 308, label: "308 — Permanente (preserve methode)" },
] as const;

export const SCHEMA_ORG_ITEMS = [
  "LocalBusiness",
  "Service",
  "FAQPage",
  "BreadcrumbList",
  "BlogPosting",
  "WebSite",
  "Organization",
  "Person",
] as const;

// Length thresholds for SEO health checks
export const TITLE_MIN = 50;
export const TITLE_MAX = 60;
export const DESC_MIN = 120;
export const DESC_MAX = 160;
