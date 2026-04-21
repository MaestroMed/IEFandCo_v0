export const LEAD_STATUSES = ["new", "contacted", "in_progress", "quoted", "won", "lost"] as const;
export const LEAD_PRIORITIES = ["low", "normal", "high"] as const;
export type LeadStatus = typeof LEAD_STATUSES[number];
export type LeadPriority = typeof LEAD_PRIORITIES[number];
