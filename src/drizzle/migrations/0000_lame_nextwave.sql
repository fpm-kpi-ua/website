CREATE TABLE `admins` (
	`user_id` text NOT NULL,
	`super_admin` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`lang` text NOT NULL,
	`section` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`keywords` text,
	`is_active` integer DEFAULT false NOT NULL,
	`article_lang` text NOT NULL,
	`source` text NOT NULL,
	`html` text NOT NULL,
	`modified_by` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	PRIMARY KEY(`created_at`, `lang`, `section`, `slug`),
	FOREIGN KEY (`modified_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `content_managers` (
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`source` text NOT NULL,
	`html` text NOT NULL,
	`lang` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reset_tokens` (
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `students` (
	`user_id` text NOT NULL,
	`group` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`user_id` text NOT NULL,
	`folders` text,
	`taken_space` integer DEFAULT 0 NOT NULL,
	`allowed_space` integer DEFAULT 500000000 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`salt` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`active` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_user_id_unique` ON `admins` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `content_managers_user_id_unique` ON `content_managers` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reset_tokens_user_id_unique` ON `reset_tokens` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `students_user_id_unique` ON `students` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teachers_user_id_unique` ON `teachers` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);