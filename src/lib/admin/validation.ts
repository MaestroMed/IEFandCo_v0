/**
 * Shared Zod helpers for admin server actions.
 *
 * Centralises validation patterns that recur across the BO, in particular
 * JSON-serialised fields (kpisJson, faqJson, productsJson, ...) which need
 * a length cap + a parseability check to defend against :
 *   - DoS (huge JSON saved to text column = memory blow-up at read time)
 *   - silent corruption (admin saves malformed JSON, content adapter fails
 *     silently and falls back to static data without telling anyone).
 */

import { z } from "zod";

/** Optional JSON-string field with a default 20 KB cap and parseability check. */
export function jsonStringField(opts?: { max?: number; max_message?: string }) {
  const max = opts?.max ?? 20000;
  const tooLong = opts?.max_message ?? `JSON trop long (max ${Math.round(max / 1024)} KB)`;
  return z
    .string()
    .max(max, { message: tooLong })
    .optional()
    .refine(
      (v) => {
        if (!v || v.trim().length === 0) return true;
        try {
          JSON.parse(v);
          return true;
        } catch {
          return false;
        }
      },
      { message: "JSON invalide" },
    );
}

/** Cap a free-text field. Defaults to 4 KB which is generous for slugs/labels
 *  but still bounds blow-up. */
export function boundedString(min = 1, max = 4000) {
  return z.string().min(min).max(max);
}

/** Optional bounded text. */
export function optionalBoundedString(max = 4000) {
  return z.string().max(max).optional();
}
