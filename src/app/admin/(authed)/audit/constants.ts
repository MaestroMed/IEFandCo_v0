export const PAGE_SIZE = 50;

export const AUDIT_ACTIONS = [
  "create",
  "update",
  "delete",
  "publish",
  "unpublish",
  "login",
  "logout",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number] | string;

export const ACTION_COLORS: Record<string, { bg: string; fg: string }> = {
  create: { bg: "rgba(60,170,140,0.15)", fg: "#3CAA8C" },
  update: { bg: "rgba(196,133,92,0.15)", fg: "var(--color-copper)" },
  delete: { bg: "rgba(225,16,33,0.12)", fg: "var(--color-primary)" },
  publish: { bg: "rgba(60,170,140,0.15)", fg: "#3CAA8C" },
  unpublish: { bg: "var(--bg-muted)", fg: "var(--text-muted)" },
  login: { bg: "rgba(59,130,180,0.12)", fg: "#3B82B4" },
  logout: { bg: "var(--bg-muted)", fg: "var(--text-muted)" },
};

const ENTITY_LINK_PREFIX: Record<string, string> = {
  lead: "/admin/leads",
  project: "/admin/projects",
  blog: "/admin/blog",
  service: "/admin/services",
  team: "/admin/team",
  testimonial: "/admin/testimonials",
  client: "/admin/clients",
  media: "/admin/media",
  site: "/admin/maintenance/sites",
  equipment: "/admin/maintenance/equipment",
  visit: "/admin/maintenance/visits",
  contract: "/admin/maintenance/contracts",
  user: "/admin/users",
  redirect: "/admin/seo/redirects",
};

export function entityHref(entity: string, entityId: string | null): string | null {
  const prefix = ENTITY_LINK_PREFIX[entity];
  if (!prefix) return null;
  return entityId ? `${prefix}/${entityId}` : prefix;
}
