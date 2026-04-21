import { randomBytes } from "node:crypto";

/**
 * Generate a 12-char temporary password mixing letters, digits and a few symbols.
 * Used by both the invite form (preview suggestion) and the server action
 * (`resetUserPassword`).
 */
export function generateTempPassword(): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  let out = "";
  const bytes = randomBytes(12);
  for (let i = 0; i < 12; i++) {
    out += charset[bytes[i] % charset.length];
  }
  return out;
}
