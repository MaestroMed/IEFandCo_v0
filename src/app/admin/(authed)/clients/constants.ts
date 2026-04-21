export const PERMISSION_STATUSES = ["not_asked", "pending", "granted", "declined"] as const;
export type PermissionStatus = typeof PERMISSION_STATUSES[number];
