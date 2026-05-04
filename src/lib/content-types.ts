/**
 * Shared types for content/seo helpers.
 *
 * This file is import-safe from BOTH server and client components — it only
 * declares types and never touches the DB. Don't add runtime code here.
 *
 * `lib/content.ts` is `server-only` (it queries the DB), so importing
 * `PublicCompanyInfo` directly from `content.ts` would taint any client
 * component that uses the type indirectly via `lib/seo.ts`. Keeping the
 * type here breaks that chain.
 */

export interface PublicCompanyInfo {
  /** Display name, e.g. "IEF & CO". */
  name: string;
  /** Legal name, e.g. "IEF AND CO". */
  legalName: string;
  /** Marketing tagline / short description (one-liner). */
  tagline: string;
  /** Tel: link target — full international format, e.g. "+33 1 34 05 87 03". */
  phone: string;
  /** Human-readable phone, e.g. "01 34 05 87 03". */
  phoneDisplay: string;
  email: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    region: string;
    country: string;
  };
  /** Free-form opening hours (single line). */
  hours: string;
  siren: string;
  naf?: string;
  tvaIntra?: string;
  rcs: string;
  capital?: string;
  president: string;
  founded: number;
  website: string;
  geo: { lat: number; lng: number };
  areaServed: string[];
  social: { linkedin?: string };
}

