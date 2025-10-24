CREATE TABLE `contact_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`message` text,
	`status` text DEFAULT 'new',
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`order_index` integer DEFAULT 0,
	`is_published` integer DEFAULT true,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery_works` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image` text NOT NULL,
	`title` text NOT NULL,
	`order_index` integer DEFAULT 0,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`is_active` integer DEFAULT true,
	`subscribed_at` text NOT NULL,
	`unsubscribed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`images` text NOT NULL,
	`material` text,
	`featured` integer DEFAULT false,
	`is_new` integer DEFAULT false,
	`is_bestseller` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`rating` integer NOT NULL,
	`text` text NOT NULL,
	`image` text NOT NULL,
	`date` text NOT NULL,
	`is_featured` integer DEFAULT true,
	`created_at` text NOT NULL
);
