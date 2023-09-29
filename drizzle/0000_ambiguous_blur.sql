CREATE TABLE `reactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reaction` smallint,
	`author_id` int,
	`blog_id` int,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `reactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`author_id` int,
	`likes` int DEFAULT 0,
	`dislikes` int DEFAULT 0,
	`comment_count` int DEFAULT 0,
	CONSTRAINT `blogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`context` text,
	`createdAt` timestamp DEFAULT (now()),
	`author_id` int,
	`blog_id` int,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`role` int NOT NULL DEFAULT 0,
	`suspended` boolean NOT NULL DEFAULT false,
	`email` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `reactions` ADD CONSTRAINT `reactions_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reactions` ADD CONSTRAINT `reactions_blog_id_blogs_id_fk` FOREIGN KEY (`blog_id`) REFERENCES `blogs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_blog_id_blogs_id_fk` FOREIGN KEY (`blog_id`) REFERENCES `blogs`(`id`) ON DELETE no action ON UPDATE no action;