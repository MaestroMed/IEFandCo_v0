CREATE TABLE `contracts` (
	`id` text PRIMARY KEY NOT NULL,
	`site_id` text NOT NULL,
	`type` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`sla_hours` integer,
	`frequency_months` integer DEFAULT 6 NOT NULL,
	`amount_ht` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `email_log` (
	`id` text PRIMARY KEY NOT NULL,
	`to_address` text NOT NULL,
	`from_address` text NOT NULL,
	`subject` text NOT NULL,
	`body_html` text NOT NULL,
	`template_key` text,
	`lead_id` text,
	`sent_by` text,
	`status` text DEFAULT 'sent' NOT NULL,
	`error_message` text,
	`sent_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`sent_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `email_log_lead_idx` ON `email_log` (`lead_id`);--> statement-breakpoint
CREATE INDEX `email_log_sent_idx` ON `email_log` (`sent_at`);--> statement-breakpoint
CREATE TABLE `email_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`body_html` text NOT NULL,
	`variables` text,
	`updated_at` integer DEFAULT (strftime('%s','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_templates_key_unique` ON `email_templates` (`key`);--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` text PRIMARY KEY NOT NULL,
	`site_id` text NOT NULL,
	`type` text NOT NULL,
	`brand` text,
	`model` text,
	`serial` text,
	`install_date` integer,
	`warranty_end` integer,
	`label` text,
	`location` text,
	`photo_media_id` text,
	`notes` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`photo_media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `equipment_site_idx` ON `equipment` (`site_id`);--> statement-breakpoint
CREATE TABLE `maintenance_visits` (
	`id` text PRIMARY KEY NOT NULL,
	`equipment_id` text,
	`site_id` text,
	`scheduled_for` integer NOT NULL,
	`done_at` integer,
	`technician_id` text,
	`type` text DEFAULT 'preventive' NOT NULL,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`report_md` text,
	`pv_pdf_url` text,
	`duration_minutes` integer,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`technician_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `visits_scheduled_idx` ON `maintenance_visits` (`scheduled_for`);--> statement-breakpoint
CREATE INDEX `visits_status_idx` ON `maintenance_visits` (`status`);--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` text PRIMARY KEY NOT NULL,
	`from_path` text NOT NULL,
	`to_path` text NOT NULL,
	`status_code` integer DEFAULT 301 NOT NULL,
	`hits` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_from_path_unique` ON `redirects` (`from_path`);--> statement-breakpoint
CREATE TABLE `sites` (
	`id` text PRIMARY KEY NOT NULL,
	`client_name` text NOT NULL,
	`label` text,
	`address` text NOT NULL,
	`city` text,
	`postal_code` text,
	`access_instructions` text,
	`contact_name` text,
	`contact_email` text,
	`contact_phone` text,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s','now')) NOT NULL
);
