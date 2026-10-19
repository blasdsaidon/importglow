PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_product_variants` (
	`id` text NOT NULL,
	`product_id` text NOT NULL,
	`label` text NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`product_id`, `id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_product_variants`("id", "product_id", "label", "price", "stock", "active", "sort_order") SELECT "id", "product_id", "label", "price", "stock", "active", "sort_order" FROM `product_variants`;--> statement-breakpoint
DROP TABLE `product_variants`;--> statement-breakpoint
ALTER TABLE `__new_product_variants` RENAME TO `product_variants`;--> statement-breakpoint
PRAGMA foreign_keys=ON;