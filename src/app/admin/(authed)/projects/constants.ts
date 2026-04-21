export const PROJECT_CATEGORIES = [
  "structures",
  "portails",
  "industrielles",
  "menuiserie",
  "coupe-feu",
  "automatismes",
  "maintenance",
] as const;
export type ProjectCategory = typeof PROJECT_CATEGORIES[number];
