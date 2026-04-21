export const EMAIL_LOG_STATUSES = ["sent", "failed", "queued"] as const;
export type EmailLogStatus = (typeof EMAIL_LOG_STATUSES)[number];

export const EMAIL_LOG_STATUS_LABELS: Record<EmailLogStatus, string> = {
  sent: "Envoye",
  failed: "Echec",
  queued: "En file",
};

export const DEFAULT_TEMPLATE_VARIABLES = [
  "firstName",
  "lastName",
  "email",
  "company",
  "serviceTitle",
  "equipmentType",
  "visitDate",
] as const;
