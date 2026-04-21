/**
 * IEF & CO — Database Schema (Drizzle ORM, SQLite dialect)
 *
 * Centralized schema for the backoffice. All content (services, blog, projects,
 * team, testimonials, clients) lives here. Public pages read from this DB with
 * fallback to seeded `src/data/*.ts` constants during migration period.
 */

import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/* ─────────── Users & Auth ─────────── */

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["owner", "admin", "editor", "viewer", "technicien"] }).notNull().default("viewer"),
  avatar: text("avatar"),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
});

/* ─────────── Leads (CRM mini) ─────────── */

export const leads = sqliteTable("leads", {
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
  receivedAt: integer("received_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
}, (t) => ({
  statusIdx: index("leads_status_idx").on(t.status),
  typeIdx: index("leads_type_idx").on(t.type),
  assignedIdx: index("leads_assigned_idx").on(t.assignedTo),
  receivedIdx: index("leads_received_idx").on(t.receivedAt),
}));

export const leadEvents = sqliteTable("lead_events", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // note, status_change, email_sent, assignment, call, tag_added, tag_removed
  actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
  payloadJson: text("payload_json"),
  at: integer("at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
}, (t) => ({
  leadIdx: index("lead_events_lead_idx").on(t.leadId),
}));

/* ─────────── Media Library ─────────── */

export const media = sqliteTable("media", {
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
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
});

/* ─────────── Projects (Realisations) ─────────── */

export const projects = sqliteTable("projects", {
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
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  coverMediaId: text("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  orderIdx: integer("order_idx").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
}, (t) => ({
  statusIdx: index("projects_status_idx").on(t.status),
  categoryIdx: index("projects_category_idx").on(t.category),
}));

export const projectImages = sqliteTable("project_images", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  mediaId: text("media_id").notNull().references(() => media.id, { onDelete: "cascade" }),
  caption: text("caption"),
  orderIdx: integer("order_idx").notNull().default(0),
});

/* ─────────── Blog ─────────── */

export const blogPosts = sqliteTable("blog_posts", {
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
  publishedAt: integer("published_at", { mode: "timestamp" }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
}, (t) => ({
  statusIdx: index("blog_status_idx").on(t.status),
  publishedIdx: index("blog_published_idx").on(t.publishedAt),
}));

/* ─────────── Services (content management) ─────────── */

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortTitle: text("short_title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  icon: text("icon").notNull(),
  accentColor: text("accent_color"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  orderIdx: integer("order_idx").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
});

export const subServices = sqliteTable("sub_services", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  orderIdx: integer("order_idx").notNull().default(0),
});

export const serviceFaqs = sqliteTable("service_faqs", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").references(() => services.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  orderIdx: integer("order_idx").notNull().default(0),
  scope: text("scope", { enum: ["service", "homepage"] }).notNull().default("service"),
});

/* ─────────── Team & social proof ─────────── */

export const teamMembers = sqliteTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  expertise: text("expertise").notNull(),
  initials: text("initials").notNull(),
  photoMediaId: text("photo_media_id").references(() => media.id, { onDelete: "set null" }),
  orderIdx: integer("order_idx").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
});

export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  author: text("author").notNull(),
  company: text("company"),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  photoMediaId: text("photo_media_id").references(() => media.id, { onDelete: "set null" }),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  orderIdx: integer("order_idx").notNull().default(0),
});

export const clients = sqliteTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logoMediaId: text("logo_media_id").references(() => media.id, { onDelete: "set null" }),
  website: text("website"),
  permissionStatus: text("permission_status", { enum: ["pending", "granted", "declined", "not_asked"] }).notNull().default("not_asked"),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  orderIdx: integer("order_idx").notNull().default(0),
});

/* ─────────── Maintenance & Operations ─────────── */

export const sites = sqliteTable("sites", {
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
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
});

export const equipment = sqliteTable("equipment", {
  id: text("id").primaryKey(),
  siteId: text("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // porte-sectionnelle | rideau-metallique | portail | coupe-feu | barriere | ...
  brand: text("brand"),
  model: text("model"),
  serial: text("serial"),
  installDate: integer("install_date", { mode: "timestamp" }),
  warrantyEnd: integer("warranty_end", { mode: "timestamp" }),
  label: text("label"), // "Porte quai 1"
  location: text("location"), // "Acces livraison nord"
  photoMediaId: text("photo_media_id").references(() => media.id, { onDelete: "set null" }),
  notes: text("notes"),
  status: text("status", { enum: ["active", "faulty", "retired"] }).notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
}, (t) => ({
  siteIdx: index("equipment_site_idx").on(t.siteId),
}));

export const maintenanceVisits = sqliteTable("maintenance_visits", {
  id: text("id").primaryKey(),
  equipmentId: text("equipment_id").references(() => equipment.id, { onDelete: "cascade" }),
  siteId: text("site_id").references(() => sites.id, { onDelete: "cascade" }),
  scheduledFor: integer("scheduled_for", { mode: "timestamp" }).notNull(),
  doneAt: integer("done_at", { mode: "timestamp" }),
  technicianId: text("technician_id").references(() => users.id, { onDelete: "set null" }),
  type: text("type", { enum: ["preventive", "curative", "audit"] }).notNull().default("preventive"),
  status: text("status", { enum: ["scheduled", "in_progress", "done", "cancelled"] }).notNull().default("scheduled"),
  reportMd: text("report_md"),
  pvPdfUrl: text("pv_pdf_url"),
  durationMinutes: integer("duration_minutes"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
}, (t) => ({
  scheduledIdx: index("visits_scheduled_idx").on(t.scheduledFor),
  statusIdx: index("visits_status_idx").on(t.status),
}));

export const contracts = sqliteTable("contracts", {
  id: text("id").primaryKey(),
  siteId: text("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["preventive", "full_service", "on_demand"] }).notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  slaHours: integer("sla_hours"), // 4, 8, 24, 48
  frequencyMonths: integer("frequency_months").notNull().default(6), // 6 = semestriel
  amountHt: integer("amount_ht"), // cents
  status: text("status", { enum: ["active", "expired", "pending"] }).notNull().default("active"),
  notes: text("notes"),
});

/* ─────────── Emails & Templates ─────────── */

export const emailTemplates = sqliteTable("email_templates", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(), // 'reply-contact', 'reply-devis', 'reminder-maintenance', 'welcome'
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  bodyHtml: text("body_html").notNull(),
  variables: text("variables"), // comma-separated: firstName,serviceTitle,...
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
});

export const emailLog = sqliteTable("email_log", {
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
  sentAt: integer("sent_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
}, (t) => ({
  leadIdx: index("email_log_lead_idx").on(t.leadId),
  sentIdx: index("email_log_sent_idx").on(t.sentAt),
}));

/* ─────────── Redirects (SEO) ─────────── */

export const redirects = sqliteTable("redirects", {
  id: text("id").primaryKey(),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  statusCode: integer("status_code").notNull().default(301),
  hits: integer("hits").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
});

/* ─────────── Settings & Audit ─────────── */

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  valueJson: text("value_json").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
});

export const auditLog = sqliteTable("audit_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  action: text("action").notNull(), // create | update | delete | login | publish
  diffJson: text("diff_json"),
  at: integer("at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s','now'))`),
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
