/**
 * IEF & CO — Database Schema (Drizzle ORM, PostgreSQL dialect)
 *
 * Centralized schema for the backoffice. All content (services, blog, projects,
 * team, testimonials, clients) lives here. Public pages read from this DB with
 * fallback to seeded `src/data/*.ts` constants if the DB is unreachable.
 *
 * Migrated from SQLite to Postgres on 2026-04 for Vercel + Supabase deployment.
 */

import { pgTable, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

/* ─────────── Users & Auth ─────────── */

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["owner", "admin", "editor", "viewer", "technicien"] }).notNull().default("viewer"),
  avatar: text("avatar"),
  lastSeenAt: timestamp("last_seen_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Leads (CRM mini) ─────────── */

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["contact", "devis"] }).notNull(),
  status: text("status", { enum: ["new", "contacted", "in_progress", "quoted", "won", "lost"] }).notNull().default("new"),
  priority: text("priority", { enum: ["low", "normal", "high"] }).notNull().default("normal"),
  // Contact
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  // Service & message
  service: text("service"),
  subject: text("subject"),
  message: text("message").notNull(),
  // Extra payload (devis: urgence, adresse)
  payloadJson: text("payload_json"),
  // Assignment
  assignedTo: text("assigned_to").references(() => users.id, { onDelete: "set null" }),
  // Metadata
  source: text("source"),
  userAgent: text("user_agent"),
  ip: text("ip"),
  // Tags
  tags: text("tags"), // comma-separated
  // Loss reason (when status=lost)
  lossReason: text("loss_reason"),
  receivedAt: timestamp("received_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  statusIdx: index("leads_status_idx").on(t.status),
  typeIdx: index("leads_type_idx").on(t.type),
  assignedIdx: index("leads_assigned_idx").on(t.assignedTo),
  receivedIdx: index("leads_received_idx").on(t.receivedAt),
}));

export const leadEvents = pgTable("lead_events", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // note, status_change, email_sent, assignment, call, tag_added, tag_removed
  actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
  payloadJson: text("payload_json"),
  at: timestamp("at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  leadIdx: index("lead_events_lead_idx").on(t.leadId),
}));

/* ─────────── Media Library ─────────── */

export const media = pgTable("media", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  url: text("url").notNull(), // local /uploads/... in dev, Vercel Blob URL in prod
  mime: text("mime").notNull(),
  width: integer("width"),
  height: integer("height"),
  bytes: integer("bytes"),
  alt: text("alt"),
  caption: text("caption"),
  tags: text("tags"), // comma-separated
  uploadedBy: text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  uploadedAt: timestamp("uploaded_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Projects (Realisations) ─────────── */

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(), // structures | portails | industrielles | menuiserie | coupe-feu | automatismes | maintenance
  clientName: text("client_name"),
  location: text("location"),
  year: integer("year"),
  description: text("description"),
  challenge: text("challenge"),
  solution: text("solution"),
  result: text("result"),
  highlight: text("highlight"), // e.g. "3200 m²"
  status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  coverMediaId: text("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  orderIdx: integer("order_idx").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  statusIdx: index("projects_status_idx").on(t.status),
  categoryIdx: index("projects_category_idx").on(t.category),
}));

export const projectImages = pgTable("project_images", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  mediaId: text("media_id").notNull().references(() => media.id, { onDelete: "cascade" }),
  caption: text("caption"),
  orderIdx: integer("order_idx").notNull().default(0),
});

/* ─────────── Blog ─────────── */

export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(), // TipTap JSON serialized
  contentHtml: text("content_html"), // Pre-rendered HTML for public display
  category: text("category", { enum: ["Guide", "Normes", "Technique", "Case Study"] }).notNull(),
  coverMediaId: text("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  tags: text("tags"), // comma-separated
  readingMinutes: integer("reading_minutes").notNull().default(5),
  status: text("status", { enum: ["draft", "scheduled", "published", "archived"] }).notNull().default("draft"),
  publishedAt: timestamp("published_at", { mode: "date", withTimezone: true }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  statusIdx: index("blog_status_idx").on(t.status),
  publishedIdx: index("blog_published_idx").on(t.publishedAt),
}));

/* ─────────── Services (content management) ─────────── */

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortTitle: text("short_title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  icon: text("icon").notNull(),
  accentColor: text("accent_color"),
  /** Cover photo / video shown on /services and /services/[slug]. */
  coverMediaId: text("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  orderIdx: integer("order_idx").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const subServices = pgTable("sub_services", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  orderIdx: integer("order_idx").notNull().default(0),
});

export const serviceFaqs = pgTable("service_faqs", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").references(() => services.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  orderIdx: integer("order_idx").notNull().default(0),
  scope: text("scope", { enum: ["service", "homepage"] }).notNull().default("service"),
});

/* ─────────── Team & social proof ─────────── */

export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  expertise: text("expertise").notNull(),
  initials: text("initials").notNull(),
  photoMediaId: text("photo_media_id").references(() => media.id, { onDelete: "set null" }),
  orderIdx: integer("order_idx").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  author: text("author").notNull(),
  company: text("company"),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  photoMediaId: text("photo_media_id").references(() => media.id, { onDelete: "set null" }),
  visible: boolean("visible").notNull().default(true),
  orderIdx: integer("order_idx").notNull().default(0),
});

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logoMediaId: text("logo_media_id").references(() => media.id, { onDelete: "set null" }),
  website: text("website"),
  permissionStatus: text("permission_status", { enum: ["pending", "granted", "declined", "not_asked"] }).notNull().default("not_asked"),
  visible: boolean("visible").notNull().default(true),
  orderIdx: integer("order_idx").notNull().default(0),
});

/* ─────────── Maintenance & Operations ─────────── */

export const sites = pgTable("sites", {
  id: text("id").primaryKey(),
  clientName: text("client_name").notNull(),
  label: text("label"), // "Siege Bercy", "Site logistique Roissy"
  address: text("address").notNull(),
  city: text("city"),
  postalCode: text("postal_code"),
  accessInstructions: text("access_instructions"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const equipment = pgTable("equipment", {
  id: text("id").primaryKey(),
  siteId: text("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // porte-sectionnelle | rideau-metallique | portail | coupe-feu | barriere | ...
  brand: text("brand"),
  model: text("model"),
  serial: text("serial"),
  installDate: timestamp("install_date", { mode: "date", withTimezone: true }),
  warrantyEnd: timestamp("warranty_end", { mode: "date", withTimezone: true }),
  label: text("label"), // "Porte quai 1"
  location: text("location"), // "Acces livraison nord"
  photoMediaId: text("photo_media_id").references(() => media.id, { onDelete: "set null" }),
  notes: text("notes"),
  status: text("status", { enum: ["active", "faulty", "retired"] }).notNull().default("active"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  siteIdx: index("equipment_site_idx").on(t.siteId),
}));

export const maintenanceVisits = pgTable("maintenance_visits", {
  id: text("id").primaryKey(),
  equipmentId: text("equipment_id").references(() => equipment.id, { onDelete: "cascade" }),
  siteId: text("site_id").references(() => sites.id, { onDelete: "cascade" }),
  scheduledFor: timestamp("scheduled_for", { mode: "date", withTimezone: true }).notNull(),
  doneAt: timestamp("done_at", { mode: "date", withTimezone: true }),
  technicianId: text("technician_id").references(() => users.id, { onDelete: "set null" }),
  type: text("type", { enum: ["preventive", "curative", "audit"] }).notNull().default("preventive"),
  status: text("status", { enum: ["scheduled", "in_progress", "done", "cancelled"] }).notNull().default("scheduled"),
  reportMd: text("report_md"),
  pvPdfUrl: text("pv_pdf_url"),
  durationMinutes: integer("duration_minutes"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  scheduledIdx: index("visits_scheduled_idx").on(t.scheduledFor),
  statusIdx: index("visits_status_idx").on(t.status),
}));

export const contracts = pgTable("contracts", {
  id: text("id").primaryKey(),
  siteId: text("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["preventive", "full_service", "on_demand"] }).notNull(),
  startDate: timestamp("start_date", { mode: "date", withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { mode: "date", withTimezone: true }),
  slaHours: integer("sla_hours"), // 4, 8, 24, 48
  frequencyMonths: integer("frequency_months").notNull().default(6), // 6 = semestriel
  amountHt: integer("amount_ht"), // cents
  status: text("status", { enum: ["active", "expired", "pending"] }).notNull().default("active"),
  notes: text("notes"),
});

/* ─────────── Emails & Templates ─────────── */

export const emailTemplates = pgTable("email_templates", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(), // 'reply-contact', 'reply-devis', 'reminder-maintenance', 'welcome'
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  bodyHtml: text("body_html").notNull(),
  variables: text("variables"), // comma-separated: firstName,serviceTitle,...
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const emailLog = pgTable("email_log", {
  id: text("id").primaryKey(),
  toAddress: text("to_address").notNull(),
  fromAddress: text("from_address").notNull(),
  subject: text("subject").notNull(),
  bodyHtml: text("body_html").notNull(),
  templateKey: text("template_key"),
  leadId: text("lead_id").references(() => leads.id, { onDelete: "set null" }),
  sentBy: text("sent_by").references(() => users.id, { onDelete: "set null" }),
  status: text("status", { enum: ["sent", "failed", "queued"] }).notNull().default("sent"),
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  leadIdx: index("email_log_lead_idx").on(t.leadId),
  sentIdx: index("email_log_sent_idx").on(t.sentAt),
}));

/* ─────────── Redirects (SEO) ─────────── */

export const redirects = pgTable("redirects", {
  id: text("id").primaryKey(),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  statusCode: integer("status_code").notNull().default(301),
  hits: integer("hits").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Rate limits (public form anti-spam) ─────────── */

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(), // `${endpoint}:${ip}:${windowStart}`
  windowStart: integer("window_start").notNull(),
  count: integer("count").notNull().default(1),
}, (t) => ({
  windowIdx: index("rate_limits_window_idx").on(t.windowStart),
}));

/* ─────────── Homepage Hero (singleton) ─────────── */

export const homepageHero = pgTable("homepage_hero", {
  id: text("id").primaryKey(), // single row with id="default"
  enabled: boolean("enabled").notNull().default(false), // when false, fallback to coded HeroSection
  eyebrow: text("eyebrow"), // small label above title (e.g. "Bureau d'étude — Atelier — Pose")
  title: text("title"), // multiline allowed
  subtitle: text("subtitle"),
  ctaPrimaryLabel: text("cta_primary_label"),
  ctaPrimaryHref: text("cta_primary_href"),
  ctaSecondaryLabel: text("cta_secondary_label"),
  ctaSecondaryHref: text("cta_secondary_href"),
  /** Background media : image (jpg/webp) or video (mp4/webm). */
  mediaId: text("media_id").references(() => media.id, { onDelete: "set null" }),
  /** Optional poster for video media (showed before video plays). */
  posterMediaId: text("poster_media_id").references(() => media.id, { onDelete: "set null" }),
  overlayOpacity: integer("overlay_opacity").notNull().default(50), // 0-100
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Page SEO (static landing/index pages) ─────────── */

export const pageSeo = pgTable("page_seo", {
  /** Stable key like "home", "services-index", "about", "contact", "devis"... */
  key: text("key").primaryKey(),
  title: text("title"),
  description: text("description"),
  /** Optional OG image override (else Next.js convention opengraph-image.tsx is used). */
  ogMediaId: text("og_media_id").references(() => media.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Page Heroes (per-page hero photo + copy override) ─────────── */
/**
 * One row per public page that has a hero band. The admin can upload a new
 * cover photo and tweak eyebrow / title / intro / image position / overlay
 * darkness without touching code. When a row is missing for a given key,
 * the page falls back to the static defaults baked into the component.
 */
export const pageHeroes = pgTable("page_heroes", {
  /** Stable key matching the page (e.g. "a-propos", "services-index", ...). */
  key: text("key").primaryKey(),
  enabled: boolean("enabled").notNull().default(true),
  /** Optional copy overrides — null means "keep the coded default". */
  eyebrow: text("eyebrow"),
  title: text("title"),
  intro: text("intro"),
  /** Hero background media (image or video). null = use the static fallback. */
  mediaId: text("media_id").references(() => media.id, { onDelete: "set null" }),
  /** CSS object-position string (e.g. "center 30%"). */
  objectPosition: text("object_position").notNull().default("center 50%"),
  /** Photo opacity [0-100]. 100 = full strength. */
  opacity: integer("opacity").notNull().default(100),
  /** Dark gradient strength on the LEFT side, 0-100. */
  overlayLeft: integer("overlay_left").notNull().default(70),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Glossary ─────────── */

export const glossaryTerms = pgTable("glossary_terms", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  term: text("term").notNull(),
  category: text("category", { enum: ["Norme", "Technique", "Composant", "Réglementation", "Méthode", "Sécurité"] }).notNull(),
  shortDef: text("short_def").notNull(),
  fullDef: text("full_def").notNull(),
  /** Comma-separated slugs of related glossary terms. */
  relatedSlugs: text("related_slugs"),
  /** Comma-separated slugs of related services. */
  relatedServices: text("related_services"),
  visible: boolean("visible").notNull().default(true),
  orderIdx: integer("order_idx").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Zones d'intervention ─────────── */

export const zones = pgTable("zones", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  code: text("code").notNull(), // 75, 92, 93...
  region: text("region").notNull().default("Île-de-France"),
  tagline: text("tagline").notNull(),
  intro: text("intro").notNull(),
  /** Comma-separated city list (display only). */
  cities: text("cities"),
  slaUrgence: text("sla_urgence").notNull(),
  slaStandard: text("sla_standard").notNull(),
  /** Comma-separated hub list. */
  hubs: text("hubs"),
  /** JSON array of {value,label,sub}. */
  kpisJson: text("kpis_json"),
  /** JSON object {author, company, quote} or null. */
  testimonialJson: text("testimonial_json"),
  /** JSON array of {question, answer}. */
  faqJson: text("faq_json"),
  centerLat: text("center_lat"),
  centerLng: text("center_lng"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  coverMediaId: text("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  visible: boolean("visible").notNull().default(true),
  orderIdx: integer("order_idx").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Maintenance brands ─────────── */

export const maintenanceBrands = pgTable("maintenance_brands", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  intro: text("intro").notNull(),
  /** JSON array of product names. */
  productsJson: text("products_json"),
  /** JSON array of common failures. */
  failuresJson: text("failures_json"),
  /** JSON array of strengths. */
  strengthsJson: text("strengths_json"),
  /** JSON array of {question, answer}. */
  faqJson: text("faq_json"),
  searchVolume: text("search_volume"), // "14k searches/mois"
  accentColor: text("accent_color"), // RGB triplet
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  logoMediaId: text("logo_media_id").references(() => media.id, { onDelete: "set null" }),
  coverMediaId: text("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  visible: boolean("visible").notNull().default(true),
  orderIdx: integer("order_idx").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Comparators (X vs Y) ─────────── */

export const comparators = pgTable("comparators", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  optionAName: text("option_a_name").notNull(),
  optionBName: text("option_b_name").notNull(),
  tagline: text("tagline").notNull(),
  intro: text("intro").notNull(),
  verdict: text("verdict").notNull(),
  /** category for illustration: industrielles | portails | structures | menuiserie | coupe-feu | automatismes | maintenance */
  category: text("category").notNull(),
  /** RGB triplet "196, 133, 92" */
  accent: text("accent").notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  visible: boolean("visible").notNull().default(true),
  orderIdx: integer("order_idx").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const comparatorRows = pgTable("comparator_rows", {
  id: text("id").primaryKey(),
  comparatorId: text("comparator_id").notNull().references(() => comparators.id, { onDelete: "cascade" }),
  criterion: text("criterion").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  /** "A" | "B" | "tie" */
  winner: text("winner", { enum: ["A", "B", "tie"] }).notNull(),
  orderIdx: integer("order_idx").notNull().default(0),
});

export const comparatorUseCases = pgTable("comparator_use_cases", {
  id: text("id").primaryKey(),
  comparatorId: text("comparator_id").notNull().references(() => comparators.id, { onDelete: "cascade" }),
  scenario: text("scenario").notNull(),
  /** "A" | "B" */
  recommendation: text("recommendation", { enum: ["A", "B"] }).notNull(),
  reason: text("reason").notNull(),
  orderIdx: integer("order_idx").notNull().default(0),
});

export const comparatorFaqs = pgTable("comparator_faqs", {
  id: text("id").primaryKey(),
  comparatorId: text("comparator_id").notNull().references(() => comparators.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  orderIdx: integer("order_idx").notNull().default(0),
});

/* ─────────── Dépannage services (urgence) ─────────── */

export const depannageServices = pgTable("depannage_services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  tagline: text("tagline").notNull(),
  intro: text("intro").notNull(),
  businessImpact: text("business_impact").notNull(),
  accentColor: text("accent_color").notNull(), // RGB triplet
  /** Comma-separated brand names supported. */
  brands: text("brands"),
  /** JSON array of {title, symptom, fix, avgDuration}. */
  failuresJson: text("failures_json"),
  /** Comma-separated list of in-stock parts. */
  partsInStock: text("parts_in_stock"),
  /** Comma-separated related service slugs (for illustration). */
  relatedServices: text("related_services"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  visible: boolean("visible").notNull().default(true),
  orderIdx: integer("order_idx").notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

/* ─────────── Settings & Audit ─────────── */

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  valueJson: text("value_json").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  action: text("action").notNull(), // create | update | delete | login | publish
  diffJson: text("diff_json"),
  at: timestamp("at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  entityIdx: index("audit_entity_idx").on(t.entity, t.entityId),
  userIdx: index("audit_user_idx").on(t.userId),
}));

/* ─────────── Type exports ─────────── */

export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type LeadEvent = typeof leadEvents.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectImage = typeof projectImages.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Service = typeof services.$inferSelect;
export type SubService = typeof subServices.$inferSelect;
export type ServiceFAQ = typeof serviceFaqs.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type AuditEntry = typeof auditLog.$inferSelect;
export type Site = typeof sites.$inferSelect;
export type Equipment = typeof equipment.$inferSelect;
export type MaintenanceVisit = typeof maintenanceVisits.$inferSelect;
export type Contract = typeof contracts.$inferSelect;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type EmailLogEntry = typeof emailLog.$inferSelect;
export type Redirect = typeof redirects.$inferSelect;
export type RateLimitRow = typeof rateLimits.$inferSelect;
export type HomepageHero = typeof homepageHero.$inferSelect;
export type PageSeo = typeof pageSeo.$inferSelect;
export type PageHero = typeof pageHeroes.$inferSelect;
export type GlossaryTermRow = typeof glossaryTerms.$inferSelect;
export type ZoneRow = typeof zones.$inferSelect;
export type MaintenanceBrandRow = typeof maintenanceBrands.$inferSelect;
export type ComparatorRow = typeof comparators.$inferSelect;
export type ComparatorTableRow = typeof comparatorRows.$inferSelect;
export type ComparatorUseCase = typeof comparatorUseCases.$inferSelect;
export type ComparatorFaq = typeof comparatorFaqs.$inferSelect;
export type DepannageServiceRow = typeof depannageServices.$inferSelect;
