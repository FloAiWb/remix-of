CREATE TABLE `equipment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`power` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`features` text NOT NULL,
	`specifications` text,
	`price` integer NOT NULL,
	`image_url` text NOT NULL,
	`created_at` text NOT NULL
);
