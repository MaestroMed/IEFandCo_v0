import { getMany, getSetting } from "@/lib/admin/settings";
import { GENERAL_KEYS, BRANDING_KEYS, INTEGRATION_KEYS, LEGAL_KEYS, NAV_KEY } from "./constants";

export async function getGeneralSettings() {
  return getMany([...GENERAL_KEYS]) as Promise<Record<(typeof GENERAL_KEYS)[number], string | null>>;
}

export async function getBrandingSettings() {
  return getMany([...BRANDING_KEYS]) as Promise<Record<(typeof BRANDING_KEYS)[number], string | null>>;
}

export async function getIntegrationsSettings() {
  return getMany([...INTEGRATION_KEYS]) as Promise<Record<(typeof INTEGRATION_KEYS)[number], string | boolean | null>>;
}

export async function getLegalSettings() {
  return getMany([...LEGAL_KEYS]) as Promise<Record<(typeof LEGAL_KEYS)[number], string | null>>;
}

export interface NavItemData {
  label: string;
  href: string;
  children?: NavItemData[];
}

export async function getNavigation(): Promise<NavItemData[] | null> {
  return getSetting<NavItemData[]>(NAV_KEY);
}
