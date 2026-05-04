export const SETTINGS_TABS = [
  { key: "general", label: "General", path: "/admin/settings/general" },
  { key: "branding", label: "Marque", path: "/admin/settings/branding" },
  { key: "navigation", label: "Navigation", path: "/admin/settings/navigation" },
  { key: "integrations", label: "Integrations", path: "/admin/settings/integrations" },
  { key: "legal", label: "Legal", path: "/admin/settings/legal" },
] as const;

export const GENERAL_KEYS = [
  "site:name",
  "site:tagline",
  "site:phone",
  "site:email",
  "site:address",
  "site:hours",
  "site:siren",
  "site:rcs",
  "site:president",
] as const;

export const BRANDING_KEYS = [
  "brand:primary-color",
  "brand:copper-color",
  "brand:favicon-url",
  "brand:og-default-image",
  "brand:logo-dark-url",
  "brand:logo-light-url",
  // Media-id based fields (resolved against the media table → url + alt)
  // Preferred path going forward; the *-url fields above remain for backwards
  // compatibility when an admin hand-pastes a URL instead of using MediaPicker.
  "brand:logo-media-id",
  "brand:logo-light-media-id",
  "brand:favicon-media-id",
  "brand:logo-alt",
] as const;

export const INTEGRATION_KEYS = [
  "int:resend-api-key",
  "int:maps-embed",
  "int:vercel-analytics",
  "int:plausible-domain",
] as const;

export const LEGAL_KEYS = ["legal:mentions", "legal:privacy"] as const;

export const NAV_KEY = "nav:main";
