CREATE TABLE `field_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inspection_id` int,
	`farmer_name` varchar(100) NOT NULL,
	`farmer_contact` varchar(15),
	`village` varchar(100),
	`district` varchar(100),
	`field_id` varchar(50),
	`app_number` varchar(50),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`field_location` text,
	`field_image_url` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `field_registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inspections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inspector_id` int,
	`crop_type` enum('Wheat','Rice','Maize','Sorghum','Sunflower'),
	`production_type` enum('Hybrid','Non-Hybrid'),
	`total_stages` int,
	`status` enum('In Progress','Completed','Rejected') DEFAULT 'In Progress',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inspections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inspectors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inspector_id` varchar(20) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`phone` varchar(15),
	`designation` varchar(100),
	`region` varchar(100),
	`role` enum('inspector','admin') DEFAULT 'inspector',
	`refresh_token` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `inspectors_id` PRIMARY KEY(`id`),
	CONSTRAINT `inspectors_inspector_id_unique` UNIQUE(`inspector_id`),
	CONSTRAINT `inspectors_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inspection_id` int,
	`verdict` enum('Approved','Provisional Approval','Rejected') NOT NULL,
	`summary_notes` text,
	`pdf_url` varchar(500),
	`email_sent` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stage_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inspection_id` int,
	`stage_number` int NOT NULL,
	`stage_name` varchar(100),
	`form_data` json,
	`notes` text,
	`completed_at` timestamp,
	CONSTRAINT `stage_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stage_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stage_data_id` int,
	`photo_url` varchar(500) NOT NULL,
	`caption` varchar(255),
	`uploaded_at` timestamp DEFAULT (now()),
	CONSTRAINT `stage_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `field_registrations` ADD CONSTRAINT `field_registrations_inspection_id_inspections_id_fk` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_inspector_id_inspectors_id_fk` FOREIGN KEY (`inspector_id`) REFERENCES `inspectors`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_inspection_id_inspections_id_fk` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stage_data` ADD CONSTRAINT `stage_data_inspection_id_inspections_id_fk` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stage_photos` ADD CONSTRAINT `stage_photos_stage_data_id_stage_data_id_fk` FOREIGN KEY (`stage_data_id`) REFERENCES `stage_data`(`id`) ON DELETE cascade ON UPDATE no action;