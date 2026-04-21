export const USER_ROLES = ["owner", "admin", "editor", "viewer", "technicien"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
  technicien: "Technicien",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: "Acces total + transfert de propriete",
  admin: "Gere contenu, equipe et parametres",
  editor: "Modifie contenu, lit le reste",
  viewer: "Consultation uniquement",
  technicien: "Acces aux fiches maintenance et visites",
};
