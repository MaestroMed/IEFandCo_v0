export const VISIT_TYPES = ["preventive", "curative", "audit"] as const;
export const VISIT_STATUSES = ["scheduled", "in_progress", "done", "cancelled"] as const;
export const EQUIPMENT_TYPES = [
  "porte-sectionnelle",
  "rideau-metallique",
  "portail-coulissant",
  "portail-battant",
  "porte-coupe-feu",
  "barriere-levante",
  "tourniquet",
  "porte-rapide",
  "porte-souple",
  "automatisme",
  "autre",
] as const;
export const EQUIPMENT_STATUSES = ["active", "faulty", "retired"] as const;
export const CONTRACT_TYPES = ["preventive", "full_service", "on_demand"] as const;
export const CONTRACT_STATUSES = ["active", "expired", "pending"] as const;
export const SLA_CHOICES = [4, 8, 24, 48] as const;
export const FREQUENCY_CHOICES = [1, 3, 6, 12] as const;

export type VisitType = (typeof VISIT_TYPES)[number];
export type VisitStatus = (typeof VISIT_STATUSES)[number];
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];
export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[number];
export type ContractType = (typeof CONTRACT_TYPES)[number];
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const VISIT_TYPE_LABELS: Record<VisitType, string> = {
  preventive: "Preventive",
  curative: "Curative",
  audit: "Audit",
};

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  scheduled: "Programmee",
  in_progress: "En cours",
  done: "Terminee",
  cancelled: "Annulee",
};

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  preventive: "Preventif",
  full_service: "Full service",
  on_demand: "A la demande",
};

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  active: "Actif",
  expired: "Expire",
  pending: "En attente",
};

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  active: "Actif",
  faulty: "En panne",
  retired: "Retire",
};
